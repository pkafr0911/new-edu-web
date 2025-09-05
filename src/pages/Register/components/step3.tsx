import { useIntl, useModel } from '@umijs/max';
import { Alert, Button, Card, Form, message, Progress, Space, Tabs, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { CSSProperties, useEffect, useState } from 'react';
import { StudentStep1, StudentStep2 } from './student';
import { CompanyStep1 } from './company';
type Props = {
  userType: 'STUDENT' | 'COMPANY';
  callback: (action: string, data: any) => void;
};
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
    padding: '48px 80px',
    overflowY: 'auto',
    maxWidth: 880,
  },
}));

const Step3: React.FC<Props> = ({ userType, callback }) => {
  const { styles } = useStyles();

  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<API.UserRequest>();
  const [progress, setProgress] = useState<number>(userType === 'STUDENT' ? 33 : 50);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const onNext = (values) => {
    const nextStep = () => {
      setStep((pev) => pev + 1);
    };

    if (step === 1) {
      setData((pev) =>
        pev
          ? {
              ...pev,
              ...values,
            }
          : undefined,
      );
      setProgress(userType === 'STUDENT' ? 66 : 100);
      nextStep();
    }

    if (step === 2) {
      setData((pev) =>
        pev
          ? {
              ...pev,
              ...values,
            }
          : undefined,
      );
      setProgress(100);
      nextStep();
    }

    if (step === 3) {
      setData((pev) =>
        pev
          ? {
              ...pev,
              ...values,
            }
          : undefined,
      );
      setProgress(100);
      nextStep();
    }
  };

  const onPrevious = () => {
    const previousStep = () => {
      setStep((pev) => pev - 1);
    };

    previousStep();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left half (image) */}
      <div className={styles.leftImage}>
        <div style={{ marginBottom: 32 }}>
          <img alt="logo" src="/logo.svg" style={{ height: 40, margin: 24 }} />
        </div>
      </div>

      {/* Right half (form) */}
      <div className={styles.rightForm}>
        {/* Process bar */}
        <div style={{ marginBottom: 40 }}>
          <Progress percent={progress} showInfo={false} />
        </div>

        {/* Form */}
        <div style={{ flex: 1 }}>
          {step === 1 ? (
            userType === 'STUDENT' ? (
              <StudentStep1 form={form1} onNext={onNext} />
            ) : (
              <CompanyStep1 form={form1} onNext={onNext} />
            )
          ) : null}
          {step === 2 ? (
            userType === 'STUDENT' ? (
              <StudentStep2 form={form2} onNext={onNext} onPrevious={onPrevious} />
            ) : (
              <CompanyStep1 form={form2} onNext={onNext} />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Step3;
