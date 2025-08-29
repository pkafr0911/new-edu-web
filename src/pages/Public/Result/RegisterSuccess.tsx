import { CheckCircleOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';
import React from 'react';
import Settings from '@/../config/defaultSettings';

const { Text } = Typography;

const RegisterSuccess: React.FC = () => {
  return (
    <Result
      icon={<CheckCircleOutlined style={{ color: Settings.colorPrimary }} />}
      title="Registration successful"
      subTitle={
        <div style={{ fontSize: 16 }}>
          <Text>
            {`Email xác nhận đăng ký thành công sẽ được gửi cho bạn trong vòng một vài ngày tới. Vui lòng kiểm tra email để nhận mã check-in của bạn.`}
          </Text>
          <br />
          <Text>
            {`(A confirmation email may be sent within a few days. Please check it to get your check-in code.)`}
          </Text>
        </div>
      }
      // extra={[
      //   <Button type="primary" key="console">
      //    {}
      //   </Button>,
      //   <Button key="buy">{}</Button>,
      // ]}
    />
  );
};
export default RegisterSuccess;
