import { RenderTime } from '@/helpers';
import { CheckCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { Button, Card, Flex, List, message, Modal, Tag, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Tilt } from 'react-tilt';
import { confirmCheckOut, fetchCheckInInfo } from '../service';

type Props = {
  event: EventsModule.Response;
  check_in_code: string;
  callback?: (data: { action: string; data?: any }) => void;
  type: 'check_in' | 'feedback';
  topBannerImageSrc?: string;
  mapImageSrc?: string;
  agendaImageSrc?: string;
};

const { Title, Text } = Typography;

const tiltOptions = {
  max: 10,
  scale: 1.05,
  speed: 400,
};

const CheckInSuccess: React.FC<Props> = ({
  event,
  check_in_code,
  callback,
  type,
  topBannerImageSrc,
  mapImageSrc,
  agendaImageSrc,
}) => {
  const [renderData, setRenderData] = useState<PublicModule.CheckInInfo>();
  const [showCheckout, setshowCheckout] = useState<boolean>(false);

  useEffect(() => {
    fetchCheckInInfo(check_in_code, event.id)
      .then(({ data }) => setRenderData(data))
      .catch((e) => {
        localStorage.removeItem('activeGuest');
        window.location.reload();
      });
  }, [check_in_code]);

  const handleCheckOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to check-out?',
      content: `This action cannot be undone.`,
      okText: 'Yes, Check-out',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const data = {
          summit_id: event.id,
          check_in_code: check_in_code,
        };

        confirmCheckOut(data).then(() => {
          //remove in local storage
          localStorage.removeItem('activeGuest');

          //
          const storedGuest = localStorage.getItem('checkedInGuest');
          if (storedGuest) {
            // Convert the object to a JSON string and store it
            const parsedData: string[] = JSON.parse(storedGuest);
            localStorage.setItem(
              'checkedInGuest',
              JSON.stringify(parsedData.filter((item) => item !== check_in_code)),
            );
          }

          message.success('Check-out successfully!');
          if (callback) {
            callback({ action: 'checkout' });
          }
        });
      },
    });
  };

  const handleDeleteActiveGuest = () => {
    //remove in local storage
    localStorage.removeItem('activeGuest');

    //rediect back
    if (callback) {
      callback({ action: 'back' });
    }
  };

  const SuccessContent: React.FC<{ type: 'check_in' | 'feedback' }> = ({ type }) => {
    if (!renderData) return null;

    if (type === 'feedback') {
      return (
        <Title level={4} style={{ marginTop: 16, color: '#424242' }}>
          Your Feedback Form has been successfully submitted. Thank you.
        </Title>
      );
    }

    return (
      <>
        <Title level={3} style={{ marginTop: 16, color: '#424242' }}>
          Check-in Successful!
        </Title>
        <Text type="secondary" strong>
          {event.name}
        </Text>
        <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#2196F3' }}>
          {RenderTime(renderData.checked_in_at)}
        </div>
        <Text type="secondary">{`Welcome ${renderData.full_name}`}</Text>
      </>
    );
  };

  return (
    <Flex justify="center" wrap gap={'small'} vertical={true}>
      {topBannerImageSrc ? (
        <img src={topBannerImageSrc} alt="map" style={{ width: '100%', height: 'auto' }} />
      ) : null}
      <Tilt options={tiltOptions}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{
              textAlign: 'center',

              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            loading={!Boolean(renderData)}
          >
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <SuccessContent type={type} />
          </Card>
        </motion.div>
      </Tilt>
      {renderData ? (
        <List
          header={`Check-in Rooms Status`}
          bordered
          dataSource={renderData.rooms}
          renderItem={(item) => {
            const room: PublicModule.CheckInInfo['rooms'][0] = item as any;
            return (
              <List.Item>
                <Typography.Text strong>{room.name}</Typography.Text>
                <span style={{ float: 'right' }}>
                  {room.is_current ? (
                    <Tooltip title={'Lucky draw available'}>
                      <Tag color="purple">{<GiftOutlined />}</Tag>
                    </Tooltip>
                  ) : null}{' '}
                  {room.checked_in_at ? (
                    <Tooltip title={RenderTime(room.checked_in_at)}>
                      <Tag color="success">
                        <CheckCircleOutlined />
                      </Tag>
                    </Tooltip>
                  ) : //  : (
                  //   <Tag>Not checked-in</Tag>
                  // )
                  null}
                </span>
              </List.Item>
            );
          }}
        />
      ) : null}
      {type === 'check_in' ? (
        <>
          {mapImageSrc ? (
            <img src={mapImageSrc} alt="map" style={{ width: '100%', height: 'auto' }} />
          ) : null}
          {agendaImageSrc ? (
            <img src={agendaImageSrc} alt="map" style={{ width: '100%', height: 'auto' }} />
          ) : null}
        </>
      ) : null}
      <Button danger onClick={handleCheckOut}>
        Check-out
      </Button>
      <Button type="link" ghost onClick={handleDeleteActiveGuest}>
        Go back
      </Button>
    </Flex>
  );
};
export default CheckInSuccess;
