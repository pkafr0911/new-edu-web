import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Space, Typography, Tabs, Card, Rate, Progress, List } from 'antd';
import { UserOutlined, ShareAltOutlined, PlusOutlined } from '@ant-design/icons';
import './styles.less';

const { Content } = Layout;
const { Text, Title } = Typography;

const companyProfile: React.FC = () => {
  const [introHtml, setIntroHtml] = useState<string>('');

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
      <div className="company-banner">
        <div>
          <img src="/company-logo.png" alt="Company" className="company-logo" />
          <Title level={3}>Trung tâm công nghệ thông tin MobiFone</Title>
          <p className="opacity-90 mt-2">Hà Nội - Đà Nẵng - TP Hồ Chí Minh | mobifone.vn</p>
        </div>

        <Space align="center">
          <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Theo dõi
          </Button>
          <Avatar.Group maxCount={3} size="large">
            <Avatar src="https://i.pravatar.cc/100?img=1" />
            <Avatar src="https://i.pravatar.cc/100?img=2" />
            <Avatar src="https://i.pravatar.cc/100?img=3" />
            <Avatar>+567</Avatar>
          </Avatar.Group>
        </Space>
      </div>

      {/* Tabs */}
      <div className="company-tabs">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Giới thiệu',
              children: (
                <div className="grid grid-cols-3 gap-8">
                  {/* General Info */}
                  <Card title="Thông tin chung">
                    <p>🕒 Thứ 2 - Thứ 6</p>
                    <p>👥 1000-2000 nhân viên</p>
                    <p>🌍 Vietnam, Úc</p>
                    <p>🏦 Ngân hàng</p>
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
                </div>
              ),
            },
            {
              key: '2',
              label: 'Đánh giá',
              children: (
                <div className="grid grid-cols-3 gap-8">
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
                </div>
              ),
            },
          ]}
        />
      </div>
    </Content>
  );
};

export default companyProfile;
