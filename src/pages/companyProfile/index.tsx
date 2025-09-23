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
  Spin,
} from 'antd';
import {
  UserOutlined,
  ShareAltOutlined,
  PlusOutlined,
  TeamOutlined,
  GlobalOutlined,
  BankOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import './styles.less';

import dayjs from 'dayjs';
import { fetchCompanyBanner, fetchCompanyDescription, fetchCompanyIntroduction } from './service';

const { Content } = Layout;
const { Text, Title, Link } = Typography;

const CompanyProfile: React.FC = () => {
  const [descHtml, setDescHtml] = useState<CompanyModule.Description>();
  const [banner, setBanner] = useState<CompanyModule.Banner>();
  const [intro, setIntro] = useState<CompanyModule.Introduction>();
  const [activeTab, setActiveTab] = useState<string>('Giới thiệu');
  const [loading, setLoading] = useState<boolean>(true);

  //fake uuid
  const id = 'de0a1d3b-5501-4fa3-a0c2-0be4b0c45db0';
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch introduction (general company info)
        const intro = await fetchCompanyIntroduction(id);
        setIntro(intro);

        // Fetch description
        const desc = await fetchCompanyDescription(id);
        setDescHtml(desc);

        // Fetch banner
        const banner = await fetchCompanyBanner(id);
        setBanner(banner);
      } catch (error) {
        console.error('Error fetching company data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const reviews = [
    {
      author: 'Hanh Pham',
      role: 'Development',
      date: dayjs('2025-03-06').format('DD/MM/YYYY'),
      rating: 4,
      comment: 'Công ty phúc lợi khá ổn, đồng nghiệp vui vẻ, hòa đồng.',
    },
    {
      author: 'Hoang Huy',
      role: 'Graphic Designer',
      date: dayjs('2025-01-04').format('DD/MM/YYYY'),
      rating: 3,
      comment: 'Benefit tốt, nhưng còn thiếu sự phát triển bản thân.',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content>
      {/* Banner */}
      <div
        style={{
          backgroundImage: `url('/images/company-profile-backgound.png')`,
        }}
        className="company-banner"
      >
        {/* Left side: logo + text */}
        <div className="company-info">
          <Avatar
            className="company-logo"
            shape="square"
            src={banner?.avatar || '/company-logo.png'}
            alt={banner?.name}
          />
          <div className="company-text">
            <Title level={3}>{banner?.name}</Title>

            <Text style={{ color: '#F7941D' }}>
              <TeamOutlined /> {banner?.openingJobs} việc làm đang tuyển dụng
            </Text>

            <Text style={{ color: '#FFF' }}>
              <EnvironmentOutlined /> {banner?.location}
            </Text>

            <Link style={{ color: '#FFF' }} href={banner?.website} target="_blank">
              <GlobalOutlined /> {banner?.website}
            </Link>

            <Link style={{ color: '#FFF' }} href={banner?.socialMedialUrl} target="_blank">
              <FacebookOutlined /> {banner?.socialMedialUrl}
            </Link>
          </div>
        </div>

        {/* Right side: buttons + avatars */}
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
                      <div className="info-value">{intro?.workingHours}</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <TeamOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Quy mô công ty</div>
                      <div className="info-value">{intro?.companyScale}</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <GlobalOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Quốc gia</div>
                      <div className="info-value">{intro?.location}</div>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="info-item">
                    <BankOutlined className="info-icon" />
                    <div>
                      <div className="info-label">Lĩnh vực</div>
                      <div className="info-value">{intro?.industry}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Company Intro */}
            <Card title="Giới thiệu công ty" className="col-span-2">
              <div dangerouslySetInnerHTML={{ __html: descHtml?.shortDescription || '<></>' }} />
            </Card>

            {/* Company Desc */}
            <Card className="col-span-2">
              <div dangerouslySetInnerHTML={{ __html: descHtml?.longDescription || '<></>' }} />
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

export default CompanyProfile;
