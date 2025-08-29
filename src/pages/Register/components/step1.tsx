import { useIntl, useModel } from '@umijs/max';
import { Alert, Button, Card, message, Space, Tabs, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { CSSProperties, useState } from 'react';
type Props = {
  callback: (action: string, data: any) => void;
};

const { Title, Text, Link } = Typography;

const Step1: React.FC<Props> = ({ callback }) => {
  const [userLoginState, setUserLoginState] = useState<Res<API.LoginResult>>({
    code: 0,
    message: '',
    data: { token: '' },
    request_id: '',
  });
  const intl = useIntl();

  const handleSubmit = (values: 'student ' | 'company') => {
    callback('submitStep1', values);
  };

  const avatarStyle: CSSProperties = {
    backgroundColor: '#F4F4F5',
    height: 120,
    width: 120,
    borderRadius: '50%',
    backgroundSize: '50%', // 50% of the circle size
    backgroundPosition: 'center', // center the image
    backgroundRepeat: 'no-repeat', // prevent tiling
  };

  const studentStyle: CSSProperties = {
    ...avatarStyle,
    backgroundImage: "url('/images/🧑🏻_🎓.png')",
  };

  const companyStyle: CSSProperties = {
    ...avatarStyle,
    backgroundImage: "url('/images/💼.png')",
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    // textAlign: 'center', // ensures text also centers horizontally
  };

  return (
    <div>
      <Title
        style={{ display: 'flex', justifyContent: 'center', color: '#fff', marginBottom: 32 }}
        level={3}
      >
        {'Xin chào! Bạn là ...?'}
      </Title>
      <Space direction="horizontal" size={'large'}>
        <Card style={{ maxWidth: 392, maxHeight: 432 }}>
          <div style={contentStyle}>
            <div style={studentStyle}></div>
            <Title level={3} style={{ marginTop: 16 }}>
              {'Sinh Viên'}
            </Title>
            <Text type="secondary" style={{ maxWidth: 312, fontSize: 'medium' }}>
              Tôi muốn hợp tác với các công ty thông qua việc hoàn thành các dự án và rèn luyện kỹ
              năng phù hợp.
            </Text>
          </div>

          <Button
            type="primary"
            style={{ marginTop: 16, width: 312, backgroundColor: '#2563EB' }}
            onClick={() => handleSubmit('student ')}
          >
            {'Đăng ký'}
          </Button>
        </Card>

        <Card style={{ maxWidth: 392, maxHeight: 432 }}>
          <div style={contentStyle}>
            <div style={companyStyle}></div>
            <Title level={3} style={{ marginTop: 16 }}>
              {'Nhà tuyển dụng'}
            </Title>
            <Text type="secondary" style={{ maxWidth: 312, fontSize: 'medium' }}>
              Tôi muốn kết nối với người học bằng cách để họ thực hiện các dự án cho công ty của
              tôi.
            </Text>

            <Button
              type="primary"
              style={{ marginTop: 16, width: 312, backgroundColor: '#2563EB' }}
              onClick={() => handleSubmit('company')}
            >
              {'Đăng ký'}
            </Button>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default Step1;
