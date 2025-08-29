import usePagination from '@/hooks/usePagination';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useModel, history } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Dropdown,
  Flex,
  InputNumber,
  InputNumberProps,
  MenuProps,
  message,
  Modal,
  QRCode,
  QRCodeProps,
  Row,
  Segmented,
  Slider,
  Space,
  Spin,
  Switch,
  SwitchProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { fetchGuestTypeOptionsList, fetchList, remove, updateStatus } from './service';
import { AssetsModal, EventModal, ViewEventModal } from './components';
import dayjs from 'dayjs';
import {
  downloadCanvasQRCode,
  downloadSvgQRCode,
  FormatInputTime,
  handlePageAfterDelete,
  RenderDuration,
  RenderTime,
  transformOptions,
} from '@/helpers';
import { DefaultOptionType } from 'antd/es/select';

/**
 * The Events Page displays a list of events and managed information.
 * @returns JSX Element
 */

const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

const Page: React.FC = () => {
  //#region set up theme
  const { initialState } = useModel('@@initialState');
  const getCardBackground = () =>
    initialState?.settings?.navTheme === 'realDark'
      ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
      : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)';

  const [loading, setLoading] = useState<boolean>(false);
  //#endregion

  //#region set up table
  const tableRef = useRef<ActionType>();
  const { formatMessage } = useIntl();
  const { paginationConfig, savePageList } = usePagination();

  //action
  const [listGuestType, setListGuestType] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    fetchGuestTypeOptionsList().then(({ data }) => {
      setListGuestType(transformOptions(data));
    });
  }, []);

  const columns: ProColumns<EventsModule.Response>[] = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      hideInSearch: true,
      render: (text, record, index) => {
        return index + 1 + (paginationConfig.current - 1) * paginationConfig.pageSize;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (_: any, record: EventsModule.Response) => (
        <Link onClick={() => handleView(record)}>{record.name}</Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      hideInSearch: true, // Don't show in default search
    },
    {
      title: formatMessage({ id: 'component.global.status' }),
      dataIndex: 'active',
      key: 'active',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: formatMessage({ id: 'component.global.active' }), value: true },
          { label: formatMessage({ id: 'component.global.inactive' }), value: false },
        ],
      },
      render: (_, record) => (
        <Tag color={record.active ? 'green' : 'red'}>
          {record.active
            ? formatMessage({ id: 'component.global.active' })
            : formatMessage({ id: 'component.global.inactive' })}
        </Tag>
      ),
    },

    {
      title: 'Event Duration',
      dataIndex: 'event_time',
      key: 'event_time',
      render: (_: any, record: EventsModule.Response) => (
        <Tooltip
          title={
            <>
              <div> {RenderTime(record.start_time)}</div>
              <div>{RenderTime(record.end_time)}</div>
            </>
          }
        >
          {RenderDuration(record.start_time, record.end_time, true)}
        </Tooltip>
      ),
      valueType: 'dateTimeRange',
      search: {
        transform: (value: any) => ({
          start_time: FormatInputTime(value[0]?.valueOf()),
          end_time: FormatInputTime(value[1]?.valueOf()),
        }),
      },

      formItemProps: {
        label: 'Range',
      },
      renderFormItem: (_: any, { type, defaultRender, ...rest }) => {
        const props = {
          ...rest,
          mode: undefined,
        };

        return <RangePicker showTime {...props} />;
      },
    },
    {
      title: 'Room',
      dataIndex: 'room_count',
      key: 'room_count',
      hideInSearch: true, // Don't show in default search
      render: (_: any, record: EventsModule.Response) => (
        <Button type="link" ghost onClick={() => history.push(`/rooms?summit_id=${record?.id}`)}>
          {record.room_count}
        </Button>
      ),
    },
    {
      title: 'Checked-in',
      dataIndex: 'checked_guest',
      key: 'checked_guest',
      align: 'center',
      hideInSearch: true, // Don't show in default search
      render: (_, record) => `${record.checked_guest} / ${record.total_guest}`,
    },
    {
      fixed: 'right',
      title: 'Actions',
      key: 'actions',
      width: 80,
      hideInSearch: true, // Don't show in default search
      render: (_: any, record: EventsModule.Response, index: number) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderActions(record, index)}
        </div>
      ),
    },
  ];

  // Dropdown Menu for Actions
  const getMenuItems = (data: EventsModule.Response, index: number): MenuProps['items'] => [
    {
      key: 'view',
      label: 'View',
      // onClick: () => handleView(data),
      onClick: () => history.push(`/events/${data.id}`),
    },
    {
      key: 'check_in_qr_code',
      label: 'Print Check-in QR code',
      onClick: () => handleViewQR(data),
    },
    {
      key: 'simulate_check_in',
      label: 'Simulate check-in',
      onClick: () => window.open(getCheckInURL(data.id)),
    },
    {
      key: 'register_qr_code',
      label: 'Print Register QR code',

      children: listGuestType.map((item) => ({
        ...item,
        key: item.id,
        onClick: () => handleViewQR(data, item.id),
      })),
    },
    {
      key: 'register',
      label: 'Register',
      children: listGuestType.map((item) => ({
        ...item,
        key: item.id,
        onClick: () => window.open(getRegisterURL(data.id, item.id)),
      })),
    },
    ...(initialState?.currentUser?.role_id && initialState?.currentUser?.role_id <= 2
      ? [
          {
            key: 'assets',
            label: 'Edit Assets',
            onClick: () => handleViewAssetsModal(data),
          },
          {
            key: 'edit',
            label: 'Edit Infomation',
            onClick: () => handleOpenEdit(data),
          },
          {
            key: 'toggle',
            label: data.active
              ? formatMessage({ id: 'component.global.deactivate' })
              : formatMessage({ id: 'component.global.activate' }),
            onClick: () => {
              if (data.active) {
                Modal.confirm({
                  title: `Are you sure you want to Deactivate this event?`,
                  okText: 'Yes, Deactivate',
                  okType: 'danger',
                  cancelText: 'Cancel',
                  onOk: () => {
                    toggleActiveStatus(data.id, false);
                  },
                });
              } else {
                toggleActiveStatus(data.id, true);
              }
            },
          },
          {
            key: 'delete',
            label: 'Delete',
            danger: true,
            onClick: () => handleDelete(data, index),
          },
        ]
      : []),
  ];
  const renderActions = (data: EventsModule.Response, index: number) => (
    <Dropdown menu={{ items: getMenuItems(data, index) }} trigger={['hover']}>
      <Button icon={<MoreOutlined />} type="dashed" />
    </Dropdown>
  );

  //#endregion

  //#region edit/create
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<EventsModule.Response>();

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditing(undefined);
    setModalVisible(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (data: EventsModule.Response) => {
    setEditing(data);
    setModalVisible(true);
  };

  // Save or Update User

  const handleSave = (data: EventsModule.Response) => {
    tableRef.current?.reload();
    setModalVisible(false);
  };
  //#endregion

  //#region delete
  // Delete User
  const handleDelete = (data: EventsModule.Response, index: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this data?',
      content: `This action cannot be undone. Deleting ${data.name}.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setLoading(true);
        remove(data.id)
          .then(() => {
            setLoading(false);
            handlePageAfterDelete(tableRef, savePageList, index);
            message.success('Event deleted successfully!');
          })
          .catch(() => setLoading(false));
      },
    });
  };
  //#endregion

  //#region view detail
  const [viewing, setViewing] = useState<EventsModule.Response>();
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Open View Modal
  const handleView = (data: EventsModule.Response) => {
    setViewing(data);
    setViewModalVisible(true);
  };

  //#endregion

  //#region assets modal
  const [viewAssetsModalVisible, setAssetsModalVisible] = useState(false);

  // Open View Modal
  const handleViewAssetsModal = (data: EventsModule.Response) => {
    setViewing(data);
    setAssetsModalVisible(true);
  };

  //#endregion

  //#region view qr code
  const [qrCodeValue, setQRCodeValue] = useState<string>('');
  const [viewQRModalVisible, setViewQRModalVisible] = useState(false);
  const [renderType, setRenderType] = useState<QRCodeProps['type']>('svg');
  const [renderSize, setRenderSize] = useState<number>(350);
  const [renderIcon, setRenderIcon] = useState<boolean>(false);

  // Open View QR Modal
  const handleViewQR = (data: EventsModule.Response, guestTypeId?: string) => {
    if (guestTypeId) {
      setQRCodeValue(getRegisterURL(data.id, guestTypeId));
    } else {
      setQRCodeValue(getCheckInURL(data.id));
    }
    setViewQRModalVisible(true);
  };

  const onChangeRenderSize: InputNumberProps['onChange'] = (newValue) => {
    setRenderSize(newValue as number);
  };

  const onChangeRenderIcon: SwitchProps['onChange'] = (newValue) => {
    setRenderIcon(newValue as boolean);
  };

  const getCheckInURL = (id: string) => {
    return `${window.location.origin}/public/confirm-check-in/${id}`;
  };

  const getRegisterURL = (summitId: string, guestTypeId: string) => {
    return `${window.location.origin}/public/register/${summitId}/${guestTypeId}`;
  };

  //#endregion

  //#region toggle active status
  // Toggle Active Status
  const toggleActiveStatus = (id: string, active: boolean) => {
    setLoading(true);
    updateStatus(id, active)
      .then(() => {
        setLoading(false);
        tableRef.current?.reload();
        message.success('Status updated successfully!');
      })
      .catch(() => setLoading(false));
  };
  //#endregion

  //#region final render
  return (
    <PageContainer>
      {loading ? <Spin spinning={true} percent={'auto'} fullscreen /> : null}
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage: getCardBackground(),
        }}
      >
        {/* Table */}
        <ProTable<EventsModule.Response>
          rowKey="id"
          columns={columns}
          actionRef={tableRef}
          request={fetchList}
          pagination={{
            onChange: (page, pageSize?) => savePageList(page, pageSize),
            pageSize: paginationConfig.pageSize,
            current: paginationConfig.current,
            showSizeChanger: true,
          }}
          columnsState={{
            persistenceKey: 'events-columns-state',
            persistenceType: 'localStorage',
            defaultValue: {
              actions: { fixed: 'right', disable: true },
            },
          }}
          search={{
            searchText: formatMessage({ id: 'component.global.search' }),
            resetText: formatMessage({ id: 'component.global.reset' }),
          }}
          toolBarRender={() => [
            <>
              {initialState?.currentUser?.role_id && initialState?.currentUser?.role_id <= 2 ? (
                <Button type="primary" onClick={handleOpenCreate}>
                  <PlusOutlined />
                  {formatMessage({ id: 'page.events.addEvent' })}
                </Button>
              ) : null}
            </>,
          ]}
          // scroll={{ x: 900 }}
        />
        {/* Create/Edit Modal */}
        <EventModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
          data={editing}
        />

        {/* View Modal */}
        <ViewEventModal
          visible={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          data={viewing}
        />

        {/* Assets Modal */}
        <AssetsModal
          visible={viewAssetsModalVisible}
          onCancel={() => setAssetsModalVisible(false)}
          data={viewing}
        />

        {/* View Print QR Modal */}
        <Modal
          open={viewQRModalVisible}
          title="Event QR code"
          onCancel={() => setViewQRModalVisible(false)}
          width={renderSize + 50}
          maskClosable={false}
          footer={[
            <Button key="close" onClick={() => setViewQRModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <Space direction="vertical">
            <Descriptions column={1}>
              <Descriptions.Item label="Type">
                <Segmented
                  options={['svg', 'canvas']}
                  value={renderType}
                  onChange={setRenderType}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Size">
                <Slider
                  min={350}
                  max={1080}
                  onChange={onChangeRenderSize}
                  value={renderSize}
                  style={{ width: renderSize / 2 }}
                />
                <InputNumber
                  min={350}
                  max={1080}
                  style={{ margin: '0 16px' }}
                  value={renderSize}
                  onChange={onChangeRenderSize}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Icon">
                <Switch value={renderIcon} onChange={onChangeRenderIcon} />
              </Descriptions.Item>
            </Descriptions>
            <Flex
              justify="center"
              vertical={true}
              wrap
              gap="small"
              style={{
                height: 'auto',
                margin: '0 auto',
                minWidth: 350,
                width: '100%',
              }}
            >
              <QRCode
                id="QRCode"
                type={renderType}
                icon={renderIcon ? '/favicon.png' : undefined}
                size={renderSize}
                value={qrCodeValue}
              />
              <Button
                type="primary"
                onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
              >
                Download
              </Button>
            </Flex>
          </Space>
        </Modal>
      </Card>
    </PageContainer>
  );
  //#endregion
};

export default Page;
