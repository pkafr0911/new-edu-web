import { Helmet, history, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { login } from './service';
import { Step1, Step2, Step3 } from './components';
import Settings from '@/../config/defaultSettings';

const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage: "url('/images/login_bg.jpg')",
    backgroundSize: '100% 100%',
  },
}));

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
  const [selectedUserType, setSelectedUserType] = useState<'STUDENT' | 'COMPANY'>();
  const [signUpData, setSignUpData] = useState<API.LoginParams | null>(null);

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
      setSelectedUserType(data);

      setStep(2);
    }
    if (action === 'submitStep2') {
      setSignUpData(data);

      setStep(3);
    }

    if (action === 'submitStep3') {
      setSignUpData(data);

      setStep(4);
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
            <img
              style={{ margin: 24 }}
              alt="logo"
              src={`${Settings.basePath.slice(0, -1)}/logo.svg`}
            />
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
            {step === 2 && selectedUserType ? (
              <Step2 userType={selectedUserType} callback={callback} />
            ) : null}
          </div>
        </div>
      ) : null}
      {step === 3 && selectedUserType ? (
        <Step3 userType={selectedUserType} callback={callback} />
      ) : null}
    </>
  );
};

export default Login;
