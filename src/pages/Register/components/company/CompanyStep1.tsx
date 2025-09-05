import React from 'react';
import { Form, Input, Button, DatePicker, FormInstance, Select, Typography } from 'antd';

type Props = {
  form: FormInstance;
  onNext?: (values: any) => void;
};
const { Title } = Typography;

const CompanyStep1: React.FC<Props> = ({ form, onNext }) => {
  const handleFinish = (values: any) => {
    if (onNext) {
      onNext(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Title level={3}>Thông tin công ty</Title>
      <Form.Item
        label={<b>Tên công ty</b>}
        name="companyName"
        required={false}
        rules={[{ required: true }]}
      >
        <Input placeholder="Nhập tên công ty" />
      </Form.Item>

      <Form.Item
        label={<b>Đia điểm</b>}
        name="location"
        required={false}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="--Chọn--"
          options={[
            {
              label: 'Ha noi',
              value: 'HN',
            },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={<b>Lĩnh vực/Ngành nghề của công ty</b>}
        name={['company', 'typeOfBusiness']}
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

      <Button
        type="primary"
        htmlType="submit"
        style={{ float: 'right', backgroundColor: '#2563EB' }}
      >
        Tiếp tục
      </Button>
    </Form>
  );
};

export default CompanyStep1;
