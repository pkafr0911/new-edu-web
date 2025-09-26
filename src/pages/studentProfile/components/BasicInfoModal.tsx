import React from 'react';
import { Avatar, Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';

const BasicInfoModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  initialValues?: StudentModule.BannerData;
}> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      width={896}
      title="Thông tin cơ bản"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={(values) => console.log('Submitted:', values)}
      >
        <Row gutter={16}>
          {/* Left: Avatar */}
          <Col span={6} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={initialValues?.education || undefined}
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
                  rules={[{ required: true, message: 'Nhập họ' }]}
                >
                  <Input placeholder="Nhập họ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[{ required: true, message: 'Nhập tên' }]}
                >
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="location" label="Địa chỉ" initialValue="Hà Nội">
                  <Select>
                    <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                    <Select.Option value="TP.HCM">TP.HCM</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="education"
                  label="Trường Cao đẳng/Đại học"
                  rules={[{ required: true, message: 'Nhập tên trường' }]}
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
