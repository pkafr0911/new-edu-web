import React from 'react';
import { Button, Typography, Flex } from 'antd';
import { history } from '@umijs/max';

type Props = {};

const { Title, Text } = Typography;

const CompanyStep3: React.FC<Props> = () => {
  const handleFinish = () => {
    history.push('/user/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
      }}
    >
      <Flex justify="center" align="center">
        <div
          style={{
            height: 120,
            width: 120,
            backgroundSize: '50%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: "url('/images/🎉.png')",
          }}
        />
      </Flex>

      <Title level={3} style={{ marginTop: 24 }}>
        Chúc mừng, bạn đã tạo tài khoản thành công
      </Title>

      <Text type="secondary" style={{ marginTop: 8, maxWidth: 400 }}>
        Bạn có thể thiết lập hồ sơ của mình hoặc khám phá các tính năng ngay bây giờ.
      </Text>

      <Button
        type="primary"
        style={{ marginTop: 32, backgroundColor: '#2563EB' }}
        onClick={handleFinish}
      >
        Quay về trang chủ →
      </Button>
    </div>
  );
};

export default CompanyStep3;
