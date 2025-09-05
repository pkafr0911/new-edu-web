import React from 'react';
import { Form, Input, Button, DatePicker, FormInstance } from 'antd';

type Props = {
  form: FormInstance;
  onNext?: (values: any) => void;
};

const CompanyStep1: React.FC<Props> = ({ form, onNext }) => {
  const handleFinish = (values: any) => {
    if (onNext) {
      onNext(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên công ty" name="fullname" rules={[{ required: true }]}>
        <Input placeholder="Nhập tên công ty" />
      </Form.Item>

      <Form.Item label="Đia điểm" name="location" rules={[{ required: true }]}>
        <Input placeholder="Nhập Đia điểm" />
      </Form.Item>

      <Form.Item label="Lĩnh vực" name={['company', 'typeOfBusiness']} rules={[{ required: true }]}>
        <Input placeholder="NhậpLĩnh vực" />
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
