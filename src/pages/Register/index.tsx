import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, Card, message, Space, Tabs, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../config/defaultSettings';
import { login } from './service';
import { Step1, Step2 } from './components';

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
    code: 0,
    message: '',
    data: { token: '' },
    request_id: '',
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  //
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company'>();
  // const fetchUserInfo = (afirstst) => {
  //   const userInfo = await initialState?.fetchUserInfo?.();
  //   if (userInfo) {
  //     flushSync(() => {
  //       setInitialState((s) => ({
  //         ...s,
  //         currentUser: userInfo,
  //       }));
  //     });
  //   }
  // };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // Login request
      const msg = await login({ ...values });
      if (msg.data) {
        const successMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login Successful!',
        });

        //set up token
        const token = msg.data.token;
        localStorage.setItem('token', token);

        //show mess
        message.success(successMessage);
        // await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // Set user error message on failure
      setUserLoginState(msg);
    } catch (error) {
      const failureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login Failed, Please try again!',
      });
      console.log(error);
      message.error(failureMessage);
    }
  };

  const callback = (action: string, data: any) => {
    if (action === 'submitStep1') {
      setSelectedRole(data);
      setStep(2);
    }
    if (action === 'submitStep2') {
      setStep(3);
    }
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
        <img style={{ margin: 24 }} alt="logo" src="/logo.svg" />
      </div>
      <div
        style={{
          flex: '1',
          padding: '42px 0',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        {step === 1 ? <Step1 callback={callback} /> : null}
        {step === 2 ? <Step2 callback={callback} /> : null}
      </div>
    </div>
  );
};

export default Login;
