import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl, useModel } from '@umijs/max';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  message,
  Progress,
  Space,
  Steps,
  Tabs,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../config/defaultSettings';
import { login } from './service';
import { Step1, Step2 } from './components';

const { Title, Text, Link } = Typography;

const useStyles = createStyles(({ token }) => ({
  leftImage: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundImage: "url('/images/register_side_image.png')",
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    width: '50%',

    // Hide image on small screens
    '@media (max-width: 768px)': {
      display: 'none',
      width: 0,
    },
  },
  rightForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '48px',
    overflowY: 'auto',
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
  const [formData, setFormData] = useState<API.LoginParams | null>(null);
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
      setFormData(data);
      setStep(3);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.register',
            defaultMessage: 'Đăng ký',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      {[1, 2].includes(step) ? (
        <div className={styles.container}>
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
      ) : null}
      {step === 3 ? (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {/* Left half (image) */}
          <div className={styles.leftImage}>
            <div style={{ marginBottom: 32 }}>
              <img alt="logo" src="/logo.svg" style={{ height: 40 }} />
            </div>
          </div>

          {/* Right half (form) */}
          <div className={styles.rightForm}>
            {/* Process bar */}
            <div style={{ marginBottom: 40 }}>
              <Progress percent={25} showInfo={false} />
            </div>

            {/* Example form */}
            <div style={{ flex: 1 }}>
              <Form layout="vertical">
                <Form.Item label="Họ và tên" name="fullname" rules={[{ required: true }]}>
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true }]}>
                  <Input placeholder="DD/MM/YYYY" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                  Tiếp tục
                </Button>
              </Form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Login;
