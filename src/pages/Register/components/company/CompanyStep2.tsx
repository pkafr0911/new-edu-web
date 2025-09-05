import React from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  FormInstance,
  Select,
  Radio,
  Space,
  Typography,
} from 'antd';

type Props = {
  form: FormInstance;
  onNext?: (values: any) => void;
  onPrevious?: (values: any) => void;
};

const { Title } = Typography;

const CompanyStep2: React.FC<Props> = ({ form, onNext, onPrevious }) => {
  const handleFinish = (values: any) => {
    if (onNext) {
      onNext(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Title level={3}>Kỳ vọng của bạn</Title>
      <Form.Item
        label={<b>Mục đích</b>}
        name={['company', 'purpose']}
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'giai cuu the gioi',
              value: 'HN',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<b>Vai trò của bạn ở công ty</b>}
        name={['company', 'typeOfBusiness']}
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'CEO',
              value: 'ceo',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<b>Bạn đã từng làm việc cùng các bạn sinh viên trước đó chưa?</b>}
        name={['company', 'hasExperiencedWorkWithStudentBefore']}
        required={false}
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value={true}>Đã từng</Radio>
            <Radio value={false}>Chưa từng</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Button onClick={onPrevious}>← Quay lại</Button>

      <Button
        type="primary"
        htmlType="submit"
        style={{ float: 'right', backgroundColor: '#2563EB' }}
      >
        Tiếp tục →
      </Button>
    </Form>
  );
};

export default CompanyStep2;
