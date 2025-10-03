import React from 'react';
import { Modal, Form, Select, Button, Space } from 'antd';

type LanguageItem = {
  id?: number;
  language: string;
  level: string;
};

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'Vietnamese', value: 'Vietnamese' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'French', value: 'French' },
];

const levelOptions = [
  { label: 'Elementary', value: 'Elementary' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Upper-Intermediate', value: 'Upper-Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Fluency', value: 'Fluency' },
  { label: 'Native', value: 'Native' },
];

const LanguageModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: LanguageItem) => void;
  initialValues?: LanguageItem;
}> = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      width={520}
      title="Ngoại ngữ"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
    >
      <Form layout="vertical" form={form} initialValues={initialValues} onFinish={onSubmit}>
        {/* Ngôn ngữ */}
        <Form.Item
          name="language"
          label="Ngôn ngữ"
          rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
        >
          <Select placeholder="- Chọn -">
            {languageOptions.map((lang) => (
              <Select.Option key={lang.value} value={lang.value}>
                {lang.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Mức độ thông thạo */}
        <Form.Item
          name="level"
          label="Mức độ thông thạo"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
        >
          <Select placeholder="Chọn mức độ">
            {levelOptions.map((level) => (
              <Select.Option key={level.value} value={level.value}>
                {level.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default LanguageModal;
