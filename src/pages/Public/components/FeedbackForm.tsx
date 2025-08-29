import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  List,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Tilt } from 'react-tilt';
import { fetchCheckInInfo, fetchRoomDetail, sendFeedback } from '../service';
import { DefaultOptionType } from 'antd/es/select';
import { useParams } from '@umijs/max';
import Settings from '@/../config/defaultSettings';
import ENV from '@/../config/envConfig';
import ReCAPTCHA from 'react-google-recaptcha';
import TextArea from 'antd/es/input/TextArea';

type Props = {
  event: EventsModule.Response;
  room_id: string;
  check_in_code: string;
  callback?: (data: { action: string; data?: any }) => void;
};

const { Title, Text, Paragraph } = Typography;

const FeedbackForm: React.FC<Props> = ({ event, room_id, check_in_code, callback }) => {
  // const { formatMessage } = useIntl();
  const [renderData, setRenderData] = useState<PublicModule.CheckInInfo>();
  const [roomData, setRoomData] = useState<RoomsModule.Response>();
  const [form] = Form.useForm();
  const [errorMess, setErrorMess] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  //captcha
  const SITE_KEY = ENV.reCaptchaKey;
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    fetchCheckInInfo(check_in_code, event.id)
      .then(({ data }) => setRenderData(data))
      .catch((e) => {
        localStorage.removeItem('activeGuest');
        window.location.reload();
      });
  }, [check_in_code]);

  useEffect(() => {
    fetchRoomDetail(room_id).then(({ data }) => {
      setRoomData(data);
    });
  }, [room_id]);

  const handleDeleteActiveGuest = () => {
    //remove in local storage
    localStorage.removeItem('activeGuest');

    //rediect back
    if (callback) {
      callback({ action: 'back' });
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  //#region submit
  const onFinish = (values) => {
    const finalData: PublicModule.FeedbackRequest = {
      ...values,
      room_id,
      check_in_code,
    };

    if (!captchaValue) {
      message.error('Please complete the CAPTCHA');
      return;
    }

    setErrorMess(undefined);
    setLoading(true);
    sendFeedback(finalData, captchaValue)
      .then(() => {
        setLoading(false);
        message.success('Send feedback successful');
        if (callback) {
          callback({ action: 'feedback' });
        }
      })
      .catch((e) => {
        setErrorMess(e);
        setLoading(false);

        // Reset ReCAPTCHA before revalidating
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setCaptchaValue(null);
        }

        //show error message
        setErrorMess(e.response?.data?.message || 'Send feedback failed, please try again.');
      });
  };

  const onFinishFailed = ({ errorFields }: any) => {
    if (errorFields.length > 0) {
      form.scrollToField(errorFields[0].name);
    }
  };
  //#endregion

  //#region service
  const [otherValue, setOtherValue] = useState<string>('');

  const serviceOption: DefaultOptionType[] = [
    { label: 'Colocation', value: 1 },
    { label: 'Cloud', value: 2 },
    { label: 'Sao lưu dự phòng dữ liệu (Backup data)', value: 3 },
    { label: 'Mạng phân phối nội dung (CDN)', value: 4 },
    { label: 'Bảo mật, an toàn thông tin (Information security and safety)', value: 5 },
    { label: 'Máy chủ vật lý và các thiết bị khác (Physical servers and other devices)', value: 6 },
    { label: 'Không có nhu cầu sử dụng (No need to use)', value: 7 },
  ];

  const handleServiceInputChange = (value) => {
    setOtherValue(value);
  };
  //#endregion

  //#region FormLabel
  const FormLabel: React.FC<{ vi: string; en: string; required?: boolean }> = ({
    vi,
    en,
    required,
  }) => {
    return (
      <Space direction="vertical" size={1}>
        <Text strong>
          {required ? <span style={{ color: 'red' }}>* </span> : null}
          {vi}
        </Text>
        <Text>{en}</Text>
      </Space>
    );
  };
  //#endregion

  //#region thoughts
  const thoughtsOption: DefaultOptionType[] = [
    {
      label: `Rất tốt (Very good)`,
      value: 4,
    },
    {
      label: `Tốt (Good)`,
      value: 3,
    },
    {
      label: `Bình thường (Normal)`,
      value: 2,
    },
    {
      label: `Không hài lòng (Unsatisfied) `,
      value: 1,
    },
  ];

  const listThought: { name: string; label: string; type: string; required?: boolean }[] = [
    {
      name: 'content_rating',
      label: `Nội dung chia sẻ của các diễn giả (Content shared by speakers)`,
      type: 'radio',
      required: true,
    },
    {
      name: 'organization_rating',
      label: `Công tác tổ chức (phòng hội thảo, thời gian tổ chức, gian hàng, nhân sự…) Organization work (place, time, booth, personnel ...)`,
      type: 'radio',
      required: true,
    },
    {
      name: 'other_sharing',
      label: `Chia sẻ khác: … (tự luận) (Other sharing)`,
      type: 'textarea',
      required: true,
    },
  ];

  const ThoughtForm: React.FC<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }> = ({ name, label, type, required }) => {
    return (
      <Col span={24}>
        <Form.Item
          name={name}
          label={label}
          rules={[
            {
              required: required,
              pattern: /^[a-zA-ZÀ-ỹ0-9-][ a-zA-ZÀ-ỹ0-9(),.\-_:\n]{0,255}$/,
              message: 'Please enter vaild content',
            },
          ]}
        >
          {type === 'radio' ? (
            <Radio.Group style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                {thoughtsOption.map((item) => (
                  <Col key={item.value} span={24}>
                    <Radio value={item.value}>{item.label}</Radio>
                  </Col>
                ))}
              </Row>
            </Radio.Group>
          ) : null}
          {type === 'textarea' ? <TextArea autoSize={{ minRows: 2 }} /> : null}
        </Form.Item>
      </Col>
    );
  };
  //#endregion

  //#region finnal render

  return (
    <Flex justify="center" wrap gap={'small'} vertical={true}>
      <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        {/* Title */}
        <Title
          level={3}
          style={{ textAlign: 'center' }}
        >{`[Feedback survey] Data Center & Cloud Infrastructure Summit 2025`}</Title>

        {/* page description */}
        <Paragraph>{`Viettel IDC trân trọng kính mời Quý vị tham gia khảo sát cho Hội nghị DCCI Summit 2025 - Green Tech, Green Future - sự kiện do Viettel IDC phối hợp với các đối tác tổ chức. Những lời góp ý của Quý vị sẽ giúp chúng tôi có thể nâng cao chất lượng hội thảo trong tương lai. Đặc biệt, nhiều phần quà hấp dẫn đang chờ đón những khách mời gửi Feedback survey tới chúng tôi. `}</Paragraph>
        <Paragraph
          style={{ fontStyle: 'italic' }}
        >{`Viettel IDC cordially invites you to fill out the Feedback survey of DCCI Summit 2025 - Green Tech, Green Future - organized by Viettel IDC and partners. Your comments will help us to improve the quality of our conferences in the future. Particularly, many attractive presents are waiting for valuable respondents.`}</Paragraph>

        {/* guest info */}

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Mã KH của Quý khách là">{check_in_code}</Descriptions.Item>
          <Descriptions.Item label="Quý khách đang tham dự">
            {roomData?.name || ''}
          </Descriptions.Item>
          <Descriptions.Item label="Họ và Tên - Full Name">
            {renderData?.full_name || ''}
          </Descriptions.Item>
        </Descriptions>

        {/* feedback form */}
        <Paragraph
          style={{ textAlign: 'center', marginTop: 25 }}
          strong
        >{`FEEDBACK SURVEY`}</Paragraph>
        <Row gutter={16}>
          <Col span={24}>
            <FormLabel
              vi={`1. Anh/chị có đánh giá thế nào về sự kiện ngày hôm nay?`}
              en={`Please share your thoughts on today’s event?`}
              required={true}
            />
          </Col>
          <Col span={24}>
            <br />
          </Col>
          {listThought.map((item) => (
            <ThoughtForm
              name={item.name}
              label={item.label}
              type={item.type}
              required={item.required}
            />
          ))}
          <Col span={24}>
            <Col span={24}>
              <Form.Item
                name="attended_previous_summit"
                label={
                  <FormLabel
                    vi={`2. Anh/chị đã từng tham gia Hội nghị DCCI Summit các năm trước chưa? `}
                    en={`Have you ever attended the DCCI Summit in previous years?`}
                    required={true}
                  />
                }
                required={false}
                rules={[
                  {
                    required: true,
                    message: 'Please select content',
                  },
                ]}
              >
                <Radio.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Radio value={true}>{`Đã từng/Yes`}</Radio>
                    </Col>
                    <Col span={12}>
                      <Radio value={false}>{`Chưa từng/No`}</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
          <Col span={24}>
            <Form.Item
              name="it_invest_annually"
              label={
                <FormLabel
                  vi={`3. Công ty của anh/chị hàng năm đầu tư ngân sách cho hạ tầng công nghệ thông tin là bao nhiêu? `}
                  en={`Does your company invest annually in information technology infrastructure?`}
                  required={true}
                />
              }
              required={false}
              rules={[
                {
                  required: true,
                  message: 'Please select content',
                },
              ]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Radio value={1}>{`Dưới 5 tỷ đồng / Under 5 billion VND`}</Radio>
                  </Col>
                  <Col span={24}>
                    <Radio
                      value={2}
                    >{`5 tỷ đồng < và < 10 tỷ đồng / 5 billion VND < and < 10 billion VND`}</Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={3}>{`Trên 10 tỷ đồng / Over 10 billion VND`}</Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="it_problem"
              label={
                <FormLabel
                  vi={`4. Công ty của anh/chị hiện có đang gặp vấn đề gì về vận hành, sử dụng hệ thống hạ tầng công nghệ thông tin?`}
                  en={`Does your company have any problems with the operation and use of information technology infrastructure systems?`}
                  required={true}
                />
              }
              required={false}
              rules={[
                {
                  required: true,
                  pattern: /^[a-zA-ZÀ-ỹ0-9-][ a-zA-ZÀ-ỹ0-9(),.\-_:\n]{0,255}$/,
                  message: 'Please enter valid content',
                },
              ]}
            >
              <TextArea autoSize={{ minRows: 2 }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="service_select"
              label={
                <FormLabel
                  vi={`5. Anh/chị muốn tìm hiểu sâu hơn và trải nghiệm dịch vụ/giải pháp nào của Viettel IDC và các đối tác? `}
                  en={`Which service/solution of Viettel IDC and our partners would you like to learn more about? Would you like to experience any service/solution of us or our partners?`}
                  required={true}
                />
              }
              required={false}
            >
              <Checkbox.Group>
                <Row gutter={[8, 8]}>
                  {serviceOption.map((item) => (
                    <Col span={24}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name="service_order"
              required={false}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const checkboxValue = getFieldValue('service_select');
                    const regex = new RegExp(/^[a-zA-ZÀ-ỹ0-9-][ a-zA-ZÀ-ỹ0-9(),.\-_:\n]{0,255}$/);
                    if ((!checkboxValue || checkboxValue.length < 1) && !value) {
                      return Promise.reject(new Error('Please select or enter content '));
                    }

                    if (value && !regex.test(value)) {
                      return Promise.reject(new Error('Please enter valid content '));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <TextArea
                placeholder="Khác: (Other)"
                value={otherValue}
                onChange={(e) => handleServiceInputChange(e.target.value)}
                autoSize={{ minRows: 2 }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="topic_next_summit"
              label={
                <FormLabel
                  vi={`6. Chủ đề mà anh/chị muốn nghe trong hội thảo kế tiếp của Viettel IDC? (tự luận) `}
                  en={`What topic would you like to discover in our next events?`}
                  required={true}
                />
              }
              required={false}
              rules={[
                {
                  required: true,
                  pattern: /^[a-zA-ZÀ-ỹ0-9-][ a-zA-ZÀ-ỹ0-9(),.\-_:\n]{0,255}$/,
                  message: 'Please enter valid content',
                },
              ]}
            >
              <TextArea autoSize={{ minRows: 2 }} />
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
                {`Submit`}
              </Button>
              {errorMess ? (
                <div style={{ color: 'red', textAlign: 'center' }}>{errorMess}</div>
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button type="link" ghost onClick={handleDeleteActiveGuest}>
        Go back
      </Button>
    </Flex>
  );
};
//#endregion

export default FeedbackForm;
