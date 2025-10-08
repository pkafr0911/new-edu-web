import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Upload, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CertificateModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  initialValues?: StudentModule.CertificateItem;
  onSubmit: (values: StudentModule.CertificateItem) => void;
}> = ({ open, onCancel, initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        issuedDate: initialValues.issueDate ? dayjs(initialValues.issueDate) : undefined,
        expirationDate: initialValues.expirationDate
          ? dayjs(initialValues.expirationDate)
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form, open]);

  const handleFinish = (values: any) => {
    const formattedValues: StudentModule.CertificateItem = {
      ...initialValues,
      ...values,
      issuedDate: values.issuedDate?.format('YYYY-MM'),
      expirationDate: values.expirationDate?.format('YYYY-MM'),
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      width={896}
      title="Bằng cấp & Chứng chỉ"
      open={open}
      onCancel={onCancel}
      centered
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="certificateName"
          label="Tên bằng cấp & chứng chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập tên bằng cấp & chứng chỉ' }]}
        >
          <Input placeholder="VD: Chứng chỉ bảo mật thông tin" />
        </Form.Item>

        <Form.Item
          name="issuer"
          label="Tổ chức phát hành"
          rules={[{ required: true, message: 'Vui lòng nhập tổ chức phát hành' }]}
        >
          <Input placeholder="VD: Đại học Bách Khoa" />
        </Form.Item>

        <Space size={16} style={{ display: 'flex', width: '100%' }}>
          <Form.Item
            name="issuedDate"
            label="Ngày cấp"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
          >
            <DatePicker picker="month" placeholder="mm/yyyy" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="expirationDate" label="Ngày hết hạn" style={{ flex: 1 }}>
            <DatePicker picker="month" placeholder="mm/yyyy" style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item name="fileUrl" label="Hình ảnh bằng cấp & chứng chỉ">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn file...</Button>
          </Upload>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
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

export default CertificateModal;
