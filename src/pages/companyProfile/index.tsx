import React, { useEffect, useState } from 'react';
import {
  Layout,
  Button,
  Avatar,
  Space,
  Typography,
  Card,
  Rate,
  Progress,
  List,
  Segmented,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  ShareAltOutlined,
  PlusOutlined,
  TeamOutlined,
  GlobalOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import './styles.less';

const { Content } = Layout;
const { Text, Title } = Typography;

const companyProfile: React.FC = () => {
  const [introHtml, setIntroHtml] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('Giới thiệu');

  useState;

  // Simulate fetching company intro HTML
  useEffect(() => {
    const fakeHtml = `
      <h3>Giới thiệu</h3>
      <p>
        Trung tâm Công nghệ Thông tin MobiFone là đơn vị trực thuộc Tổng Công ty Viễn thông
        MobiFone, với sứ mệnh phát triển các giải pháp công nghệ và chuyển đổi số tiên tiến.
      </p>
      <ul>
        <li>💡 Cung cấp giải pháp phần mềm cho doanh nghiệp.</li>
        <li>🌍 Hợp tác với nhiều đối tác quốc tế.</li>
        <li>📈 Định hướng phát triển bền vững và sáng tạo.</li>
      </ul>
      <p>
        Với hơn <strong>1500 nhân viên</strong>, MobiFone IT đã và đang đồng hành cùng hàng ngàn khách hàng
        trong và ngoài nước.
      </p>
    `;
    setIntroHtml(fakeHtml);
  }, []);

  const reviews = [
    {
      author: 'Hanh Pham',
      role: 'Development',
      date: '3/6/2025',
      rating: 4,
      comment: 'Công ty phúc lợi khá ổn, đồng nghiệp vui vẻ, hòa đồng.',
    },
    {
      author: 'Hoang Huy',
      role: 'Graphic Designer',
      date: '1/4/2025',
      rating: 3,
      comment: 'Benefit tốt, nhưng còn thiếu sự phát triển bản thân.',
    },
  ];

  return (
    <Content>
      {/* Banner */}
      <div
        style={{
          backgroundImage: "url('/images/company-profile-backgound.png')",
        }}
        className="company-banner"
      >
        {/* Left side: logo + text inline */}
        <div className="company-info">
          <img src="/company-logo.png" alt="Company" className="company-logo" />
          <div className="company-text">
            <Title level={3}>Trung tâm công nghệ thông tin MobiFone</Title>
            <p className="opacity-90 mt-2">Hà Nội - Đà Nẵng - TP Hồ Chí Minh | mobifone.vn</p>
          </div>
        </div>

        {/* Right side: buttons on top, avatars below */}
        <div className="company-actions">
          <Space>
            <Button ghost icon={<ShareAltOutlined />}>
              Chia sẻ
            </Button>
            <Button ghost icon={<PlusOutlined />}>
              Theo dõi
            </Button>
          </Space>

          <Avatar.Group maxCount={3} size="large">
            <Avatar src="https://i.pravatar.cc/100?img=1" />
            <Avatar src="https://i.pravatar.cc/100?img=2" />
            <Avatar src="https://i.pravatar.cc/100?img=3" />
            <Avatar>+567</Avatar>
          </Avatar.Group>
        </div>
      </div>

      {/* Segmented Switch */}
      <div className="company-tabs">
        <Segmented
          options={['Giới thiệu', 'Đánh giá']}
          value={activeTab}
          onChange={(val) => setActiveTab(val as string)}
          style={{ marginBottom: 24 }}
        />

        {activeTab === 'Giới thiệu' && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* General Info */}
            <Card title="Thông tin chung">
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <ClockCircleOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Thời gian làm việc</div>
                      <div className="info-value">Thứ 2 - Thứ 6</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <TeamOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Quy mô công ty</div>
                      <div className="info-value">1000-2000 nhân viên</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <GlobalOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Quốc gia</div>
                      <div className="info-value">Vietnam, Úc</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <BankOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Lĩnh vực</div>
                      <div className="info-value">Ngân hàng</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Company Intro */}
            <Card title="Giới thiệu công ty" className="col-span-2">
              <div dangerouslySetInnerHTML={{ __html: introHtml }} />
              <div className="grid grid-cols-3 gap-2 mt-4">
                <img src="/img1.jpg" className="rounded-lg" />
                <img src="/img2.jpg" className="rounded-lg" />
                <img src="/img3.jpg" className="rounded-lg" />
              </div>
            </Card>
          </Space>
        )}

        {activeTab === 'Đánh giá' && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Rating Overview */}
            <Card title="Đánh giá" className="col-span-1">
              <Rate disabled defaultValue={4} />
              <p className="rating-score">4.0 / 5</p>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="progress-label">Lương thưởng & Phúc lợi</div>
                  <Progress percent={80} showInfo={false} />
                </div>
                <div>
                  <div className="progress-label">Đào tạo & Học hỏi</div>
                  <Progress percent={75} showInfo={false} />
                </div>
                <div>
                  <div className="progress-label">Văn hóa công ty</div>
                  <Progress percent={70} showInfo={false} />
                </div>
              </div>
            </Card>

            {/* Review List */}
            <Card title="Nhận xét từ nhân viên" className="col-span-2">
              <List
                dataSource={reviews}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{item.author}</Text>
                          <Text type="secondary">{item.role}</Text>
                          <Text type="secondary">{item.date}</Text>
                        </Space>
                      }
                      description={<Rate disabled defaultValue={item.rating} />}
                    />
                    <p>{item.comment}</p>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        )}
      </div>
    </Content>
  );
};

export default companyProfile;
