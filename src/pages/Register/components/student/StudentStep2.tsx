import React from 'react';
import { Form, Button, FormInstance, Select, Typography } from 'antd';

type Props = {
  form: FormInstance;
  onNext?: (values: any) => void;
  onPrevious?: (values: any) => void;
};

const { Title } = Typography;

const StudentStep2: React.FC<Props> = ({ form, onNext, onPrevious }) => {
  const handleFinish = (values: any) => {
    if (onNext) {
      onNext(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Title level={3}>Kinh nghiệm làm việc</Title>
      <Form.Item
        label={<b>Trường đại học</b>}
        name={['intern', 'university']}
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'Black khoa',
              value: 'bach_khoa',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<b>Bằng cấp</b>}
        name={['intern', 'degree']}
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'cu nhan',
              value: 'cu_nhan',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<b>Ngành học</b>}
        name={['intern', 'major']}
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'cong nghe thong tin',
              value: 'cntt',
            },
          ]}
        />
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

export default StudentStep2;
