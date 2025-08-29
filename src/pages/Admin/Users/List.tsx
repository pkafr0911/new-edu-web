import usePagination from '@/hooks/usePagination';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Dropdown,
  MenuProps,
  message,
  Modal,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';
import { fetchList, remove, updateStatus } from './service';
import { ChangePasswordModal, UserModal } from './components';
import { SYSTEM_ROLE } from '@/consants';
import RoleTag from '@/components/RoleTag';
import { FormatInputTime, handlePageAfterDelete, RenderTime } from '@/helpers';

/**
 * The Users Page displays a list of users and managed information.
 * @returns JSX Element
 */

const { RangePicker } = DatePicker;

const Page: React.FC = () => {
  //#region set up theme
  const { initialState } = useModel('@@initialState');
  const getCardBackground = () =>
    initialState?.settings?.navTheme === 'realDark'
      ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
      : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)';
  //#endregion

  //#region set up table
  const tableRef = useRef<ActionType>();
  const { formatMessage } = useIntl();
  const { paginationConfig, savePageList } = usePagination();

  // console.log('props', useParams());

  const columns: ProColumns<UserModule.Response>[] = [
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      copyable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      copyable: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      formItemProps: {
        labelCol: { xxl: 8 },
      },
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
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: SYSTEM_ROLE[1], value: 1 }, // super admin
          { label: SYSTEM_ROLE[2], value: 2 }, // admin
          { label: SYSTEM_ROLE[3], value: 3 }, // user
        ],
      },
      render: (_, record) => <RoleTag role_id={record.role_id} />,
    },

    //TODO:
    // {
    //   title: '2FA Status',
    //   dataIndex: 'twofa_status',
    //   key: 'twofa_status',
    //   valueType: 'select',
    //   fieldProps: {
    //     options: [
    //       { label: formatMessage({ id: 'component.global.enable' }), value: true },
    //       { label: formatMessage({ id: 'component.global.disable' }), value: false },
    //     ],
    //   },
    //   render: (_, record) => (
    //     <Tag color={record.twofa_status ? 'blue' : 'gray'}>
    //       {record.twofa_status
    //         ? formatMessage({ id: 'component.global.enable' })
    //         : formatMessage({ id: 'component.global.disable' })}
    //     </Tag>
    //   ),
    // },
    {
      title: formatMessage({ id: 'component.global.created_at' }),
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateTimeRange',
      search: {
        transform: (value: any) => ({
          start_time: FormatInputTime(value[0]?.valueOf()),
          end_time: FormatInputTime(value[1]?.valueOf()),
        }),
      },

      renderFormItem: (_: any, { type, defaultRender, ...rest }) => {
        const props = {
          ...rest,
          mode: undefined,
        };

        return <RangePicker showTime {...props} />;
      },
      render: (_: any, record: UserModule.Response) => RenderTime(record.created_at),
    },

    {
      fixed: 'right',
      title: formatMessage({ id: 'component.global.actions' }),
      key: 'actions',
      width: 80,
      hideInSearch: true,
      render: (_: any, record: UserModule.Response, index: number) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderActions(record, index)}
        </div>
      ),
    },
  ];

  // Dropdown Menu for Actions
  const getMenuItems = (data: UserModule.Response, index: number): MenuProps['items'] => [
    {
      key: 'view',
      label: formatMessage({ id: 'component.global.view' }),
      onClick: () => handleView(data),
    },
    ...(initialState?.currentUser?.role_id === 1 || // super admin can do all
    (initialState?.currentUser?.role_id && initialState?.currentUser?.role_id < data.role_id) // data role have to be lower role to enable below action
      ? [
          {
            key: 'edit',
            label: formatMessage({ id: 'component.global.edit' }),
            onClick: () => handleOpenEdit(data),
          },

          //do not show it if is the user loging in
          ...(initialState?.currentUser?.id !== data.id
            ? [
                {
                  key: 'reset_password',
                  label: formatMessage({ id: 'page.admin.users.reset_password' }),
                  onClick: () => handleOpenResetPassword(data),
                },
                {
                  key: 'toggle',
                  label: data.active
                    ? formatMessage({ id: 'component.global.deactivate' })
                    : formatMessage({ id: 'component.global.activate' }),
                  onClick: () => {
                    if (data.active) {
                      Modal.confirm({
                        title: `Are you sure you want to Deactivate this user?`,
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
                  label: formatMessage({ id: 'component.global.delete' }),
                  danger: true,
                  onClick: () => handleDelete(data, index),
                },
              ]
            : []),
        ]
      : []),
  ];
  const renderActions = (data: UserModule.Response, index: number) => (
    <Dropdown menu={{ items: getMenuItems(data, index) }} trigger={['hover']}>
      <Button icon={<MoreOutlined />} type="dashed" />
    </Dropdown>
  );

  //#endregion

  //#region edit/create
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<UserModule.Response>();

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditing(undefined);
    setModalVisible(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (data: UserModule.Response) => {
    setEditing(data);
    setModalVisible(true);
  };

  // Save or Update User

  const handleSave = (data: UserModule.Response) => {
    // console.log('data', data);
    tableRef.current?.reload();
    setModalVisible(false);
  };
  //#endregion

  //#region delete
  // Delete User
  const handleDelete = (data: UserModule.Response, index: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this data?',
      content: `This action cannot be undone. Deleting ${data.full_name}.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        remove(data.id).then(() => {
          handlePageAfterDelete(tableRef, savePageList, index);
          message.success('User deleted successfully!');
        });
      },
    });
  };
  //#endregion

  //#region view
  const [viewing, setViewing] = useState<UserModule.Response>();
  const [viewModalVisible, setViewModalVisible] = useState(false);

  // Open View Modal
  const handleView = (data: UserModule.Response) => {
    setViewing(data);
    setViewModalVisible(true);
  };

  //#endregion

  //#region toggle active status
  // Toggle Active Status
  const toggleActiveStatus = (id: string, active: boolean) => {
    updateStatus(id, active).then(() => {
      tableRef.current?.reload();
      message.success('Status updated successfully!');
    });
  };
  //#endregion

  //#region toggle active status
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);

  // Reset password
  const handleOpenResetPassword = (data: UserModule.Response) => {
    setEditing(data);
    setResetPasswordModalVisible(true);
  };
  //#endregion

  //#region final render
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage: getCardBackground(),
        }}
      >
        {/* Table */}
        <ProTable<UserModule.Response>
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
          search={{
            searchText: formatMessage({ id: 'component.global.search' }),
            resetText: formatMessage({ id: 'component.global.reset' }),
          }}
          toolBarRender={() => [
            <>
              {/* {checkPermissions('USER_CREATE_ACCOUNT') ? ( */}
              <Button type="primary" onClick={handleOpenCreate}>
                <PlusOutlined />
                {formatMessage({ id: 'page.admin.users.addUser' })}
              </Button>
              {/* ) : null} */}
            </>,
          ]}
          scroll={{ x: 1100 }}
        />
        {/* Create/Edit Modal */}
        <UserModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
          data={editing}
        />

        {/* Change Password Modal */}
        <ChangePasswordModal
          visible={resetPasswordModalVisible}
          mode="reset"
          onCancel={() => setResetPasswordModalVisible(false)}
          onSave={() => setResetPasswordModalVisible(false)}
          id={editing?.id}
        />

        {/* View User Modal */}
        <Modal
          open={viewModalVisible}
          title="User Details"
          onCancel={() => setViewModalVisible(false)}
          maskClosable={false}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {viewing && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Name">{viewing.full_name}</Descriptions.Item>
              <Descriptions.Item label="Username">{viewing.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{viewing.phone_number}</Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'component.global.status' })}>
                {viewing.active ? (
                  <Tag color="green">{formatMessage({ id: 'component.global.active' })}</Tag>
                ) : (
                  <Tag color="red">{formatMessage({ id: 'component.global.inactive' })}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {<RoleTag role_id={viewing.role_id} />}
              </Descriptions.Item>
              <Descriptions.Item label="2FA Status">
                {
                  <Tag color={viewing.twofa_status ? 'blue' : 'gray'}>
                    {viewing.twofa_status
                      ? formatMessage({ id: 'component.global.enable' })
                      : formatMessage({ id: 'component.global.disable' })}
                  </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {RenderTime(viewing.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {RenderTime(viewing.last_updated_at)}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
  //#endregion
};

export default Page;
