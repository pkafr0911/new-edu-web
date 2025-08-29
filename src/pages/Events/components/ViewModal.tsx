import React, { useEffect } from 'react';
import { Modal, Button, Descriptions, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { fetchItem } from '../service';
import { history, useIntl } from '@umijs/max';
import { RenderTime, transformOptions } from '@/helpers';
import { DefaultOptionType } from 'antd/es/select';

type Props = {
  visible: boolean;
  onCancel: () => void;
  data?: EventsModule.Response; // Optional: If provided, edit mode; else, create mode
  id?: string; // Optional: If provided and data is undefined => fetch item data base on id
};

const { Text } = Typography;

const ViewEventModal: React.FC<Props> = ({ visible, onCancel, data, id }) => {
  const { formatMessage } = useIntl();
  const [loading, setLoading] = React.useState(false);
  const [renderData, setRenderData] = React.useState<EventsModule.Response>();
  const [rooms, setRooms] = React.useState<DefaultOptionType[]>([]);

  useEffect(() => {
    if (data) {
      setRenderData(transformResData(data));
    } else if (id) {
      setLoading(true);
      fetchItem(id)
        .then((res) => {
          setRenderData(transformResData(res));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [data, id]);

  const transformResData = (data: EventsModule.Response) => {
    return {
      ...data,
      time_range:
        data?.start_time && data?.end_time ? [dayjs(data.start_time), dayjs(data.end_time)] : null,
    };
  };

  return (
    <Modal
      open={visible}
      title="Event Details"
      onCancel={onCancel}
      loading={loading}
      maskClosable={false}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      {renderData && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{renderData.name}</Descriptions.Item>
          <Descriptions.Item label="Description">{renderData.description}</Descriptions.Item>

          <Descriptions.Item label="Room">
            {rooms.map((item) => (
              <Tag>
                <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: item.label }}>
                  {item.label}
                </Text>
              </Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Checked-in">{`${renderData.checked_guest} / ${renderData.total_guest}`}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'component.global.status' })}>
            {renderData.active ? (
              <Tag color="green">{formatMessage({ id: 'component.global.active' })}</Tag>
            ) : (
              <Tag color="red">{formatMessage({ id: 'component.global.inactive' })}</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {RenderTime(renderData.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Start Time">
            {RenderTime(renderData.start_time)}
          </Descriptions.Item>
          <Descriptions.Item label="End Time">{RenderTime(renderData.end_time)}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ViewEventModal;
