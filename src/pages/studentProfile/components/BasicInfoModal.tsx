import React, { useEffect } from 'react';
import { Avatar, Button, Col, Form, Input, Modal, Row, Select, Space, notification } from 'antd';
import { updateStudentInfo } from '../service';

// ✅ Regex patterns
const NameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // Vietnamese + English letters only
const PhoneRegex = /^(0|\+84)(\d{9})$/; // Valid VN phone (0xxxxxxxxx or +84xxxxxxxxx)
const EducationRegex = /^[A-Za-zÀ-ỹ0-9\s.,'"-]+$/; // Allow names with letters, numbers, and punctuation

const BasicInfoModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  initialValues?: StudentModule.BannerData;
  onSuccess?: () => void;
}> = ({ open, onCancel, initialValues, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        phoneNumber: initialValues.phoneNumber,
        location: initialValues.location,
        education: initialValues.education,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: any) => {
    if (!initialValues?.id) {
      notification.error({ message: 'Không tìm thấy ID sinh viên' });
      return;
    }

    try {
      await updateStudentInfo(initialValues.id, {
        ...values,
        avatarUrl:
          initialValues.avatarUrl ||
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffree-png-vectors%2Favatar&psig=AOvVaw0LKugZiFvyD4zqGtFkvCzp&ust=1759851369411000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOi9_q_zj5ADFQAAAAAdAAAAABAE',
      });

      notification.success({ message: 'Cập nhật thông tin sinh viên thành công' });
      onCancel();
      onSuccess?.();
    } catch (err: any) {
      notification.error({
        message: 'Lỗi khi cập nhật',
        description: err.message,
      });
    }
  };

  return (
    <Modal
      width={896}
      title="Thông tin cơ bản"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          {/* Left: Avatar */}
          <Col span={6} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={initialValues?.avatarUrl}
              style={{ display: 'block', margin: '0 auto' }}
            />
            <Button type="link" style={{ marginTop: 8 }}>
              Thay ảnh
            </Button>
          </Col>

          {/* Right: Form Fields */}
          <Col span={18}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Họ"
                  rules={[
                    { required: true, message: 'Nhập họ' },
                    { pattern: NameRegex, message: 'Họ chỉ được chứa chữ cái và dấu cách' },
                  ]}
                >
                  <Input placeholder="Nhập họ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[
                    { required: true, message: 'Nhập tên' },
                    { pattern: NameRegex, message: 'Tên chỉ được chứa chữ cái và dấu cách' },
                  ]}
                >
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Nhập số điện thoại' },
                    {
                      pattern: PhoneRegex,
                      message: 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="location"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Chọn địa chỉ' }]}
                >
                  <Select placeholder="Chọn địa chỉ">
                    <Select.Option value="1">Hà Nội</Select.Option>
                    <Select.Option value="2">TP.HCM</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="education"
                  label="Trường Cao đẳng/Đại học"
                  rules={[
                    { required: true, message: 'Nhập tên trường' },
                    { pattern: EducationRegex, message: 'Tên trường không hợp lệ' },
                  ]}
                >
                  <Input placeholder="Nhập tên trường" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BasicInfoModal;
