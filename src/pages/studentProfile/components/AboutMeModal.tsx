import React from 'react';
import { Modal, Form, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AboutMeModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  initialValue?: string;
}> = ({ open, onCancel, initialValue }) => {
  const [form] = Form.useForm();

  const onSubmit = (values: any) => {
    console.log('About me submitted:', values.aboutMe);
    onCancel(); // close modal after submit
  };

  return (
    <Modal
      title="Giới thiệu bản thân"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ aboutMe: initialValue }}
      >
        <Form.Item
          name="aboutMe"
          rules={[{ required: true, message: 'Vui lòng nhập thông tin giới thiệu' }]}
        >
          <ReactQuill
            theme="snow"
            placeholder="Nhập thông tin giới thiệu bản thân"
            style={{ height: 250 }}
          />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AboutMeModal;
