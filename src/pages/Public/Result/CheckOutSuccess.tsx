import { RenderTime } from '@/helpers';
import { CheckCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { Button, Card, Flex, List, message, Modal, Tag, Tooltip, Typography } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Tilt } from 'react-tilt';
import { confirmCheckOut, fetchCheckInInfo } from '../service';

type Props = {
  event: EventsModule.Response;
  callback?: (data: { action: string; data?: any }) => void;
};

const { Title, Text } = Typography;

const tiltOptions = {
  max: 10,
  scale: 1.05,
  speed: 400,
};

const CheckOutSuccess: React.FC<Props> = ({ event, callback }) => {
  const handleGoBack = () => {
    //rediect back
    if (callback) {
      callback({ action: 'back' });
    }
  };

  return (
    <Flex justify="center" wrap gap={'small'} vertical={true}>
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
          >
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <Title level={3} style={{ marginTop: 16, color: '#424242' }}>
              Check-out Successful!
            </Title>
            <Text type="secondary" strong>
              {event.name}
            </Text>
            <br />
            <Text type="secondary">{`See you in next event`}</Text>
          </Card>
        </motion.div>
      </Tilt>
      <Button type="link" ghost onClick={handleGoBack}>
        Go back
      </Button>
    </Flex>
  );
};
export default CheckOutSuccess;
