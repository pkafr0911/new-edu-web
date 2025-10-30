import React from 'react';
import { Modal, Form, Button, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateStudentDescription } from '../service';

const AboutMeModal: React.FC<{
  id: string;
  open: boolean;
  onCancel: () => void;
  initialValue?: string;
}> = ({ open, onCancel, id, initialValue }) => {
  const [form] = Form.useForm();

  const onSubmit = async (values: any) => {
    try {
      await updateStudentDescription(id, values.description);
      message.success('Cập nhật giới thiệu bản thân thành công');
      onCancel();
    } catch (error) {
      console.error(error);
      message.error('Cập nhật thất bại, vui lòng thử lại');
    }
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
        initialValues={{ description: initialValue }}
      >
        <Form.Item
          name="description"
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
