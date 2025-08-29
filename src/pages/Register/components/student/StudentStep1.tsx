import React from 'react';
import { Form, Input, Button } from 'antd';

interface RegistrationFormProps {
  onSubmit?: (values: any) => void;
}

const StudentStep1: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Họ và tên"
        name="fullname"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="dob"
        rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
      >
        <Input placeholder="DD/MM/YYYY" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Tiếp tục
      </Button>
    </Form>
  );
};

export default StudentStep1;
