import React from 'react';
import { Modal, Form, Input, Checkbox, DatePicker, Select } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;

interface WorkExperienceModalProps {
  open: boolean;
  onCancel: () => void;
  initialValues?: any;
}

const WorkExperienceModal: React.FC<WorkExperienceModalProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const current = Form.useWatch('current', form);

  const onSubmit = (values: any) => {};

  return (
    <Modal
      title="Kinh nghiệm làm việc"
      open={open}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Chức danh"
          name="position"
          rules={[{ required: true, message: 'Vui lòng nhập chức danh' }]}
        >
          <Input placeholder="VD: UI/UX Designer" />
        </Form.Item>

        <Form.Item
          label="Loại hình công việc"
          name="employmentType"
          rules={[{ required: true, message: 'Vui lòng chọn loại hình công việc' }]}
        >
          <Select
            placeholder="Chọn loại hình"
            options={[
              { label: 'Toàn thời gian', value: 'fulltime' },
              { label: 'Bán thời gian', value: 'parttime' },
              { label: 'Thực tập', value: 'internship' },
              { label: 'Freelance', value: 'freelance' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Tên công ty"
          name="company"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
        >
          <Input placeholder="VD: Vietcombank" />
        </Form.Item>

        <Form.Item name="current" valuePropName="checked">
          <Checkbox>Tôi đang làm việc tại đây</Checkbox>
        </Form.Item>

        <Form.Item label="Thời gian làm việc" style={{ marginBottom: 0 }}>
          <Form.Item
            name="from"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
          >
            <DatePicker format="MM/YYYY" picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              textAlign: 'center',
              lineHeight: '40px',
            }}
          >
            -
          </span>
          <Form.Item
            name="to"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            rules={[
              {
                validator(_, value) {
                  if (current || value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Vui lòng chọn thời gian kết thúc'));
                },
              },
            ]}
          >
            <DatePicker
              format="MM/YYYY"
              picker="month"
              style={{ width: '100%' }}
              disabled={current}
            />
          </Form.Item>
        </Form.Item>

        {/* ✅ ReactQuill Editor */}
        <Form.Item label="Mô tả chi tiết" name="description">
          <ReactQuill
            theme="snow"
            placeholder="Mô tả công việc, nhiệm vụ, thành tựu..."
            onChange={(value) => form.setFieldValue('description', value)}
            value={form.getFieldValue('description')}
            style={{ height: 200, marginBottom: 40 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkExperienceModal;
