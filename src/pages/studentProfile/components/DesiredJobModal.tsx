import React from 'react';
import { Modal, Form, Input, Select, Radio, Button, Row, Col } from 'antd';

const DesiredJobModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  initialValues?: any;
}> = ({ open, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  const currencies = [
    { label: 'VND', value: 'VND' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'JPY', value: 'JPY' },
    { label: 'GBP', value: 'GBP' },
    { label: 'AUD', value: 'AUD' },
    { label: 'CAD', value: 'CAD' },
    { label: 'CHF', value: 'CHF' },
    { label: 'CNY', value: 'CNY' },
    { label: 'HKD', value: 'HKD' },
    { label: 'KRW', value: 'KRW' },
    { label: 'SGD', value: 'SGD' },
    { label: 'THB', value: 'THB' },
    { label: 'INR', value: 'INR' },
    { label: 'NZD', value: 'NZD' },
    { label: 'SEK', value: 'SEK' },
    { label: 'NOK', value: 'NOK' },
    { label: 'RUB', value: 'RUB' },
    { label: 'BRL', value: 'BRL' },
    { label: 'ZAR', value: 'ZAR' },
  ];

  const onSubmit = (values: any) => {
    console.log('Submitted:', values);
  };

  return (
    <Modal
      title="Công việc mong muốn"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onSubmit} initialValues={initialValues}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maxSalary"
              label="Mức lương tối đa"
              rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa' }]}
            >
              <Input
                type="number"
                placeholder="0"
                addonAfter={
                  <Form.Item name="maxSalaryCurrency" noStyle initialValue="VND">
                    <Select style={{ width: 80 }}>
                      {currencies.map((currency) => (
                        <Select.Option key={currency.value} value={currency.value}>
                          {currency.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="minSalary"
              label="Mức lương tối thiểu"
              rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu' }]}
            >
              <Input
                type="number"
                placeholder="0"
                addonAfter={
                  <Form.Item name="minSalaryCurrency" noStyle initialValue="VND">
                    <Select style={{ width: 80 }}>
                      {currencies.map((currency) => (
                        <Select.Option key={currency.value} value={currency.value}>
                          {currency.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="location"
              label="Nơi làm việc mong muốn"
              rules={[{ required: true, message: 'Vui lòng chọn nơi làm việc' }]}
            >
              <Select placeholder="- Chọn -">
                <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                <Select.Option value="TP.HCM">TP.HCM</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="level"
              label="Cấp bậc mong muốn"
              rules={[{ required: true, message: 'Vui lòng chọn cấp bậc' }]}
            >
              <Select placeholder="- Chọn -">
                <Select.Option value="Nhân viên">Nhân viên</Select.Option>
                <Select.Option value="Quản lý">Quản lý</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="expectedJobType"
              label="Hình thức làm việc"
              rules={[{ required: true, message: 'Vui lòng chọn hình thức làm việc' }]}
            >
              <Select placeholder="- Chọn -">
                <Select.Option value="Toàn thời gian">Toàn thời gian</Select.Option>
                <Select.Option value="Bán thời gian">Bán thời gian</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="industry"
              label="Ngành nghề"
              rules={[{ required: true, message: 'Vui lòng nhập ngành nghề' }]}
            >
              <Input placeholder="Nhập ngành nghề" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="isNeedMentor"
              label="Mong muốn có người đào tạo, hướng dẫn"
              rules={[{ required: true, message: 'Vui lòng chọn lựa chọn' }]}
            >
              <Radio.Group>
                <Radio value="optional">Tùy tình huống</Radio>
                <Radio value="yes">Có</Radio>
                <Radio value="no">Không</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={onCancel}>Hủy</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DesiredJobModal;
