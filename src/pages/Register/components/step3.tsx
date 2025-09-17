import { Form, Progress } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { StudentStep1, StudentStep2, StudentStep3, StudentStep4 } from './student';
import { CompanyStep1, CompanyStep2, CompanyStep3 } from './company';
import Settings from '@/../config/defaultSettings';

type Props = {
  userType: 'STUDENT' | 'COMPANY';
  callback: (action: string, data: any) => void;
};

const useStyles = createStyles(() => ({
  leftImage: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundImage: "url('/images/register_side_image.png')",
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center',
    width: '50%',
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

  useEffect(() => {
    console.log('step', step);
  }, [step]);

  const handleNext = (values: any) => {
    setData((prev) => (prev ? { ...prev, ...values } : undefined));

    if (userType === 'STUDENT') {
      if (step === 1) setProgress(66);
      if (step === 2) setProgress(99);
      if (step === 3) setProgress(100);
    } else {
      if (step === 1) setProgress(99);
      if (step === 2) setProgress(100);
    }
    setStep((prev) => prev + 1);

    // if (step === 3 && userType === 'STUDENT') {
    //   // Last step → trigger API / callback
    //   callback('submitStep3', data);
    // }

    // if (step === 4 && userType === 'COMPANY') {
    //   // Last step → trigger API / callback
    //   callback('submitStep3', data);
    // }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const renderForm = () => {
    if (userType === 'STUDENT') {
      switch (step) {
        case 1:
          return <StudentStep1 form={form1} onNext={handleNext} />;
        case 2:
          return <StudentStep2 form={form2} onNext={handleNext} onPrevious={handlePrevious} />;
        case 3:
          return <StudentStep3 form={form3} onNext={handleNext} onPrevious={handlePrevious} />;
        case 4:
          return <StudentStep4 />;
        default:
          return null;
      }
    }

    // COMPANY user flow
    switch (step) {
      case 1:
        return <CompanyStep1 form={form1} onNext={handleNext} />;
      case 2:
        return <CompanyStep2 form={form2} onNext={handleNext} />;
      case 3:
        return <CompanyStep3 />;
      default:
        return null;
    }
  };

  const showProgress = (userType === 'STUDENT' && step < 4) || (userType === 'COMPANY' && step < 3);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Side (Image) */}
      <div className={styles.leftImage}>
        <img
          alt="logo"
          src={`${Settings.basePath.slice(0, -1)}/logo.svg`}
          style={{ height: 40, margin: 24 }}
        />
      </div>

      {/* Right Side (Form & Progress) */}
      <div className={styles.rightForm}>
        {showProgress && (
          <div style={{ marginBottom: 40 }}>
            <Progress percent={progress} showInfo={false} />
          </div>
        )}
        <div style={{ flex: 1 }}>{renderForm()}</div>
      </div>
    </div>
  );
};

export default Step3;
