import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, message, Row, Col, Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { disabledDate, FormatInputTime } from '@/helpers';
import { create, fetchItem, fetchListContent, update } from '../service';
import { EditOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import DraggerInModal from './DraggerInModal';
import { AssetKey } from '@/consants';

type Props = {
  visible: boolean;
  onCancel: () => void;
  data?: EventsModule.Response; // Optional: If provided, edit mode; else, create mode
  id?: string; // Optional: If provided and data is undefined => fetch item data base on id
};

const AssetsModal: React.FC<Props> = ({ visible, onCancel, data, id }) => {
  const [loading, setLoading] = React.useState(false);
  const [Data, setData] = useState<EventsModule.Response>();
  const [listAssetsKey, setListAssetsKey] = useState<string[]>();

  useEffect(() => {
    if (data) {
      setData(transformResData(data));
    } else if (id) {
      setLoading(true);
      fetchItem(id)
        .then((res) => {
          setData(transformResData(res));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [data, id]);

  useEffect(() => {
    if (Data) {
      fetchListContent(Data.id, { current: 1, pageSize: 100 }).then(({ data }) => {
        setListAssetsKey(data.map((item) => item.key));
      });
    }
  }, [Data]);

  const transformResData = (data: EventsModule.Response) => {
    return {
      ...data,
      time_range:
        data?.start_time && data?.end_time ? [dayjs(data.start_time), dayjs(data.end_time)] : null,
    };
  };
  const handleCallback = (data: { action: string; data: any }) => {
    if (data.action === 'add') {
      setListAssetsKey((pev) => (pev ? [...new Set([...pev, data.data])] : [data.data]));
      return;
    }
    if (data.action === 'remove') {
      setListAssetsKey((pev) => pev?.filter((item) => item !== data.data));
      return;
    }
  };

  return (
    <Modal
      open={visible}
      title={data ? 'Edit Event Assets' : 'Create Event Assets'}
      onCancel={onCancel}
      loading={loading}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      {Data && listAssetsKey && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Divider orientation="left">Submit code</Divider>
          <DraggerInModal
            listKey={listAssetsKey}
            data={Data}
            label="Top banner"
            imageKey={AssetKey.SubmiteCodeTopBanner}
            callback={handleCallback}
          />

          <Divider orientation="left">Feedback success</Divider>
          <DraggerInModal
            listKey={listAssetsKey}
            data={Data}
            label="Top banner"
            imageKey={AssetKey.FeedbackTopBanner}
            callback={handleCallback}
          />

          <Divider orientation="left">Check-in success</Divider>
          <DraggerInModal
            listKey={listAssetsKey}
            data={Data}
            label="Top banner"
            imageKey={AssetKey.CheckInSuccessTopBanner}
            callback={handleCallback}
          />
          <DraggerInModal
            listKey={listAssetsKey}
            data={Data}
            label="Map"
            imageKey={AssetKey.CheckInSuccessMap}
            callback={handleCallback}
          />
          <DraggerInModal
            listKey={listAssetsKey}
            data={Data}
            label="Agenda"
            imageKey={AssetKey.CheckInSuccessAgenda}
            callback={handleCallback}
          />
        </Space>
      )}
    </Modal>
  );
};

export default AssetsModal;
