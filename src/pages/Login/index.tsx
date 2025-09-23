import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, Card, message, Space, Tabs, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { login } from './service';
import Settings from '@/../config/defaultSettings';

const { Title, Text, Link } = Typography;

const useStyles = createStyles(({ token }) => ({
  action: {
    marginLeft: '8px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: token.colorPrimaryActive,
    },
  },
  lang: {
    width: 42,
    height: 42,
    lineHeight: '42px',
    position: 'fixed',
    right: 16,
    borderRadius: token.borderRadius,
    ':hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage: "url('/images/login_bg.jpg')",
    backgroundSize: '100% 100%',
  },
}));

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

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

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<Res<API.LoginResult>>({
    errorCode: 0,
    message: '',
    data: { token: '' },
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // try {
    //   // Login request
    //   const msg = await login({ ...values });
    //   if (msg.data) {
    //     const successMessage = intl.formatMessage({
    //       id: 'pages.login.success',
    //       defaultMessage: 'Login Successful!',
    //     });

    //     //set up token
    //     const token = msg.data.token;
    //     localStorage.setItem('token', token);

    //     //show mess
    //     message.success(successMessage);
    //     await fetchUserInfo();
    //     const urlParams = new URL(window.location.href).searchParams;
    //     history.push(urlParams.get('redirect') || '/');
    //     return;
    //   }
    //   // Set user error message on failure
    //   setUserLoginState(msg);
    // } catch (error) {
    //   const failureMessage = intl.formatMessage({
    //     id: 'pages.login.failure',
    //     defaultMessage: 'Login Failed, Please try again!',
    //   });
    //   console.log(error);
    //   message.error(failureMessage);
    // }

    history.push('/');
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: 'Login Page',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      {/* <Lang /> */}
      <div>
        <img style={{ margin: 24 }} alt="logo" src={`${Settings.basePath.slice(0, -1)}/logo.svg`} />
      </div>
      <div
        style={{
          flex: '1',
          padding: '42px 0',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Card style={{ maxWidth: '75vw', maxHeight: 450 }}>
          <Title level={3} style={{ padding: '0px 32px' }}>
            {'Đăng nhập'}
          </Title>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            submitter={{
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
            </>

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <Text strong>
                  <FormattedMessage
                    id="pages.login.rememberMe"
                    defaultMessage="Ghi nhớ tài khoản"
                  />
                </Text>
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="Quên mật khẩu" />
              </a>
            </div>

            {userLoginState.errorCode !== 0 && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: 'Incorrect account or password',
                })}
              />
            )}
          </LoginForm>

          <Space style={{ justifyContent: 'center', display: 'flex' }}>
            <Text>Bạn chưa có tài khoản?</Text>
            <Link onClick={() => history.push('/user/register')}>Đăng ký ngay</Link>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Login;
