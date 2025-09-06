import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl } from '@umijs/max';
import { Alert, Button, Card, Input, message, Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

type Props = {
  userType: 'STUDENT' | 'COMPANY';
  callback: (action: string, data: any) => void;
};

const { Title, Text, Link } = Typography;

const LoginMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Step2: React.FC<Props> = ({ userType, callback }) => {
  const [userLoginState, setUserLoginState] = useState<Res<API.LoginResult>>({
    code: 0,
    message: '',
    data: { token: '' },
    request_id: '',
  });
  const intl = useIntl();

  const [openOTP, setOpenOTP] = useState<boolean>(false);
  const [formData, setFormData] = useState<API.LoginParams | null>(null); // store register form values

  const handleSubmit = async (values: API.LoginParams) => {
    setFormData(values); // keep form data
    sendOPT();
    setOpenOTP(true);
  };

  const sendOPT = () => {
    //TODO: call api Signup

    const reqData = {
      ...formData,
      userType,
    };

    console.log('reqData', reqData);

    message.success('Mã OTP đã được gửi đến email của bạn!');
  };

  const renderOTPModal = () => {
    const [countdown, setCountdown] = useState(60); // 60s countdown
    const [canResend, setCanResend] = useState(false);
    const [otp, setOtp] = useState('');

    useEffect(() => {
      if (openOTP && countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (countdown === 0) {
        setCanResend(true);
      }
    }, [openOTP, countdown]);

    const handleResend = () => {
      sendOPT(); // your existing function to send OTP
      setCountdown(60);
      setCanResend(false);
    };

    const onChange = (value) => {
      setOtp(value);
      if (value.length === 6) {
        //TODO: call api Verify

        const reqData = {
          email: formData?.email,
          otpCode: otp,
        };

        message.success('Đăng ký thành công!');
        // history.push('/user/login');
        if (formData) {
          callback('submitStep2', formData); // send form data to parent
        }
      }
    };

    return (
      <Modal open={openOTP} onCancel={() => setOpenOTP(false)} footer={null}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Title level={3}>Nhập mã OTP</Title>
          <Text strong>Vui lòng nhập mã đã được gửi đến email của bạn</Text>
          <Input.OTP length={6} size="large" value={otp} onChange={onChange} />

          <Space direction="horizontal">
            {canResend ? (
              <Button type="link" onClick={handleResend}>
                Gửi lại mã
              </Button>
            ) : (
              <Text strong>
                {'00:'}
                {countdown}
              </Text>
            )}
          </Space>
        </Space>
      </Modal>
    );
  };

  return (
    <>
      {' '}
      <Card style={{ maxWidth: '75vw', maxHeight: 550 }}>
        <Title level={3} style={{ padding: '0px 32px' }}>
          {'Đăng Ký'}
        </Title>
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: 'Đăng ký',
            },
            submitButtonProps: {
              style: {
                backgroundColor: '#2563EB',
                width: '100%',
              },
            },
          }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <>
            <ProFormText
              label="Email"
              name="email"
              fieldProps={{
                size: 'large',
                tabIndex: 1,
              }}
              placeholder={'Nhập email'}
              required={false}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="Please enter your email!"
                    />
                  ),
                },
                {
                  type: 'email',
                  message: 'Email sai định dạng',
                },
              ]}
            />
            <ProFormText.Password
              label="Mật khẩu"
              name="password"
              fieldProps={{
                size: 'large',
                tabIndex: 2,
              }}
              placeholder={'Nhập mật khẩu'}
              required={false}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="Please enter your password!"
                    />
                  ),
                },
              ]}
            />

            <ProFormText.Password
              label="Nhập lại Mật khẩu"
              name="repeatPassword"
              fieldProps={{
                size: 'large',
                tabIndex: 2,
              }}
              placeholder={'Nhập mật khẩu'}
              required={false}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="Please enter your password!"
                    />
                  ),
                },
              ]}
            />
          </>
          {userLoginState.code !== 0 && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Incorrect account or password',
              })}
            />
          )}
        </LoginForm>

        <Space style={{ justifyContent: 'center', display: 'flex' }}>
          <Text>Bạn đã có tài khoản?</Text>
          <Link onClick={() => history.push('/user/login')}>Đăng nhập</Link>
        </Space>
      </Card>
      {renderOTPModal()}
    </>
  );
};

export default Step2;
