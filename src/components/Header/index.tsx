import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { BellOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import './styles.less';
import Settings from '@/../config/defaultSettings';

const { Header } = Layout;

const CustomHeader: React.FC<{ currentUser?: API.CurrentUser }> = ({ currentUser }) => {
  const isLoggedIn = !!currentUser;

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', label: 'Hồ sơ' },
        { key: 'logout', label: 'Đăng xuất' },
      ]}
    />
  );

  return (
    <Header className="custom-header">
      {/* Left: Logo + Nav */}
      <div className="header-left">
        {/* Logo */}
        <div className="header-logo" onClick={() => history.push('/')}>
          <img src={`${Settings.basePath.slice(0, -1)}/logo.svg`} alt="New Edu" />
        </div>

        {/* Nav items */}
        <Menu
          mode="horizontal"
          theme="dark"
          className="header-menu"
          items={[
            { key: 'about', label: 'Về New Edu' },
            { key: 'program', label: 'Chương trình' },
            { key: 'partner', label: 'Đối tác' },
            { key: 'solution', label: 'Giải pháp' },
            { key: 'resource', label: 'Nguồn lực' },
          ]}
        />
      </div>

      {/* Right: Buttons */}
      <Space size="large">
        {/* Nhà tuyển dụng */}
        <Button className="employer-btn" icon={<SolutionOutlined />}>
          Nhà tuyển dụng
        </Button>

        {/* Notification Bell */}
        <Button className="bell-btn" shape="circle" icon={<BellOutlined />} />

        {!isLoggedIn ? (
          <>
            <Button
              type="primary"
              className="register-btn"
              onClick={() => history.push('/register')}
            >
              Đăng ký
            </Button>
            <Button
              type="default"
              className="login-btn"
              onClick={() => history.push('/user/login')}
            >
              Đăng nhập
            </Button>
          </>
        ) : (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space>
              <Avatar src={currentUser?.avatar} icon={<UserOutlined />} />
              <span className="username">{currentUser?.username}</span>
            </Space>
          </Dropdown>
        )}
      </Space>
    </Header>
  );
};

export default CustomHeader;
