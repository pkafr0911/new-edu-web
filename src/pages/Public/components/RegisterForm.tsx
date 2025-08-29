import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Typography } from 'antd';
import CryptoJS from 'crypto-js';
import {
  fetchEncryptKey,
  fetchJobTitlesOptions,
  fetchMarketingSourcesOptions,
  fetchRoomsOptions,
  register,
} from '../service';
import { transformOptions } from '@/helpers';
import { DefaultOptionType } from 'antd/es/select';
import { message } from 'antd/lib';
import { Helmet, useIntl, useParams } from '@umijs/max';
import querystring from 'query-string';
import Settings from '@/../config/defaultSettings';
import ENV from '@/../config/envConfig';
import RegisterSuccess from '../Result/RegisterSuccess';
import { registerLabel } from '../constants';
import ReCAPTCHA from 'react-google-recaptcha';

type Props = {
  lang: 'en' | 'vi';
  centered?: boolean; // set true to center the confirm modal
  callback?: (data: { action: string; data?: any }) => void;
};

const { Paragraph, Title } = Typography;

const RegisterForm: React.FC<Props> = ({ lang, callback, centered }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { summitId, guestTypeId } = useParams();
  const [marketingSources, setMarketingSources] = useState<DefaultOptionType[]>([]);
  const [rooms, setRooms] = useState<DefaultOptionType[]>([]);
  const [jobTitles, setJobTitles] = useState<DefaultOptionType[]>([]);
  const [errorMess, setErrorMess] = useState<string>();

  //
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  //captcha
  const SITE_KEY = ENV.reCaptchaKey;
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  //#region set select options
  useEffect(() => {
    fetchJobTitlesOptions(lang).then(({ data }) => {
      setJobTitles(transformOptions(data));
    });

    fetchMarketingSourcesOptions(lang).then(({ data }) => {
      setMarketingSources(transformOptions(data));
    });
    if (summitId) {
      fetchRoomsOptions(summitId, lang).then(({ data }) => {
        setRooms(transformOptions(data));
      });
    }
  }, []);
  //#endregion

  //#region get color
  const getColor = () => {
    const { color } = querystring.parse(location.search);
    return color
      ? ['red', 'green', 'gray'].includes(color as string)
        ? { red: '#ee0033', green: '#32a852', gray: '#707070' }[color as string]
        : `#${color}`
      : undefined;
  };
  //#endregion

  //#region submit

  const onRegister = async (values) => {
    const finalData = { ...values, guest_type_id: guestTypeId, summit_id: summitId };

    if (!captchaValue) {
      message.error('Please complete the CAPTCHA');
      return;
    }

    setErrorMess(undefined);
    setLoading(true);
    register(finalData, captchaValue)
      .then(({ data }) => {
        message.success('Registration successful!');
        setLoading(false);
        if (callback) {
          callback({ action: 'register', data });
        } else {
          setShowResult(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        // Reset ReCAPTCHA before revalidating
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaValue(null);
        }

        //show error message
        setErrorMess(e.response?.data?.message || 'Registration failed, please try again.');
      });
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: registerLabel.confirm[lang],
      content: <Paragraph>{registerLabel.warning_mess[lang]}</Paragraph>,
      okText: registerLabel.ok[lang],
      okType: 'primary',
      cancelText: registerLabel.cancel[lang],
      onOk: () => onRegister(values),
      centered,
    });
  };

  const onFinishFailed = ({ errorFields }: any) => {
    if (errorFields.length > 0) {
      form.scrollToField(errorFields[0].name);
    }
  };
  //#endregion

  return (
    <div>
      <Helmet>
        <title>
          {registerLabel.register[lang]}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      {!showResult ? (
        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row gutter={16}>
            <Col sm={24}>
              <Title level={5} style={{ color: Settings.colorPrimary }}>
                {registerLabel.registeration_title[lang]}
              </Title>
            </Col>
            <Col sm={24}>
              <Paragraph style={{ color: getColor(), textAlign: 'center' }}>
                {registerLabel.header[lang]}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="full_name"
                label={registerLabel.full_name[lang]}
                rules={[
                  {
                    required: true,
                    pattern: /^[a-zA-ZÀ-ỹ][ a-zA-ZÀ-ỹ]{0,255}$/,
                    message: 'Please enter name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label={registerLabel.email[lang]}
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone_number"
                label={registerLabel.phone_number[lang]}
                rules={[
                  {
                    required: true,
                    pattern: /^[0-9]{10,11}$/,
                    message: 'Enter a valid phone number (10-11 digits)',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="job_title_id"
                label={registerLabel.job_title_id[lang]}
                rules={[{ required: true, message: 'Please select a job title' }]}
              >
                <Select options={jobTitles} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="organization_name"
                rules={[
                  {
                    required: true,
                    pattern: /^[a-zA-ZÀ-ỹ0-9][ a-zA-ZÀ-ỹ0-9]{0,255}$/,
                    message: 'Enter a valid organization name',
                  },
                ]}
                label={registerLabel.organization_name[lang]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="industry"
                label={registerLabel.industry[lang]}
                rules={[
                  {
                    pattern: /^[a-zA-ZÀ-ỹ][ a-zA-ZÀ-ỹ]{0,255}$/,
                    message: 'Enter a valid industry',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24}>
              <Form.Item
                name="organization_addr"
                label={registerLabel.organization_addr[lang]}
                rules={[
                  {
                    pattern: /^[a-zA-ZÀ-ỹ0-9][ a-zA-ZÀ-ỹ0-9,-/]{0,255}$/,
                    message: 'Enter a valid organization address',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={24}>
              <Form.Item
                name="rooms"
                label={registerLabel.rooms[lang]}
                rules={[{ required: true, message: 'Please select' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    {rooms.map((item) => (
                      <Col key={item.id} xs={24} sm={8}>
                        <Checkbox value={item.id}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Title level={5} style={{ color: Settings.colorPrimary }}>
                {registerLabel.servey_title[lang]}
              </Title>
            </Col>
            <Col sm={24}>
              <Form.Item
                name="marketing_sources"
                label={registerLabel.marketing_sources[lang]}
                rules={[{ required: true, message: 'Please select marketing sources' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    {marketingSources.map((item) => (
                      <Col key={item.id} xs={24} sm={12}>
                        <Checkbox value={item.id}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Form.Item>
                <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} onChange={handleCaptchaChange} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                <Button
                  disabled={loading || !Boolean(captchaValue)}
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    backgroundColor: Boolean(captchaValue) ? Settings.colorPrimary : undefined,
                  }}
                >
                  {registerLabel.register[lang]}
                </Button>
                {errorMess ? (
                  <div style={{ color: 'red', textAlign: 'center' }}>{errorMess}</div>
                ) : null}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : null}
      {showResult ? <RegisterSuccess /> : null}
    </div>
  );
};

export default RegisterForm;
