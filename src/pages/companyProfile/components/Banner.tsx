import React from 'react';
import { Avatar, Button, Space, Typography } from 'antd';
import {
  ShareAltOutlined,
  PlusOutlined,
  TeamOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Banner: React.FC<{ banner?: CompanyModule.Banner }> = ({ banner }) => {
  return (
    <div
      style={{
        backgroundImage: `url('/images/company-profile-backgound.png')`,
      }}
      className="company-banner"
    >
      {/* Left */}
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

      {/* Right */}
      <div className="company-actions">
        <Space>
          <Button
            type="text"
            style={{ color: '#fff', border: '1px solid' }}
            icon={<ShareAltOutlined />}
          >
            Chia sẻ
          </Button>
          <Button
            type="text"
            style={{ color: '#fff', border: '1px solid' }}
            icon={<PlusOutlined />}
          >
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
  );
};

export default Banner;
