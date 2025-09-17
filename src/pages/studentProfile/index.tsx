import React from 'react';
import {
  Layout,
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Progress,
  Button,
  Space,
  List,
  Tag,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BookOutlined,
  FilePdfOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './styles.less';

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentProfile: React.FC = () => {
  return (
    <Content className="student-profile">
      <Row gutter={24}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Card className="sidebar-card">
            <Title level={4}>Tài khoản</Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                'Tổng quan',
                'Việc làm của tôi',
                'Nhà tuyển dụng/Công ty',
                'Lời mời công việc',
                'Thông báo',
                'Cài đặt',
              ]}
              renderItem={(item, index) => (
                <List.Item className={index === 0 ? 'active' : ''}>{item}</List.Item>
              )}
            />

            <div className="progress-section">
              <Progress type="circle" percent={75} size={100} strokeColor="#1890ff" />
              <p>
                Woww! Làm 100% luôn bạn ơi, rất nhiều nhà tuyển dụng đã sẵn sàng để đón bạn đó
                nha!!!
              </p>
            </div>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} md={18}>
          {/* Profile Header */}
          <Card className="profile-header" extra={<Button icon={<EditOutlined />}>Sửa</Button>}>
            <Row gutter={16} align="middle">
              <Col>
                <Avatar size={96} src="https://i.pravatar.cc/150?img=5" />
              </Col>
              <Col flex="auto">
                <Title level={4}>Hà Ngọc Tú</Title>
                <Space direction="vertical" size={4}>
                  <Text>
                    <PhoneOutlined /> 0965558884
                  </Text>
                  <Text>
                    <MailOutlined /> tuhnt71@gmail.com
                  </Text>
                  <Text>
                    <EnvironmentOutlined /> Hà Nội
                  </Text>
                  <Text>
                    <BookOutlined /> Đại học Ngoại Thương
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Stats */}
          <Row gutter={16} className="stats-row">
            {[
              { label: 'Đã ứng tuyển', value: 8 },
              { label: 'Việc làm đã lưu', value: 11 },
              { label: 'Việc đã làm', value: 6 },
              { label: 'Đánh giá', value: '4.5 ★' },
            ].map((stat, idx) => (
              <Col xs={12} md={6} key={idx}>
                <Card className="stat-card">
                  <Title level={4}>{stat.value}</Title>
                  <Text>{stat.label}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Personal Photos */}
          <Card title="Ảnh cá nhân">
            <Row gutter={16}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Col key={i}>
                  <img
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    alt="profile"
                    className="profile-photo"
                  />
                </Col>
              ))}
            </Row>
          </Card>

          {/* Bio */}
          <Card title="Giới thiệu bản thân">
            <p>
              Tôi là UI/UX Designer với hơn 8 năm kinh nghiệm... đã và đang làm việc tại các công ty
              lớn.
            </p>
            <p>
              Portfolio: <a href="https://www.behance.net/tuhna">behance.net/tuhna</a>
            </p>
            <p>Skype: live:tuhnt71 | Email: tuhnt71@gmail.com</p>
          </Card>

          {/* Job Preference */}
          <Card title="Công việc mong muốn">
            <Row gutter={16}>
              <Col span={6}>
                <Text strong>Mức lương mong muốn</Text>
                <p>7tr - 10tr</p>
              </Col>
              <Col span={6}>
                <Text strong>Nơi làm việc mong muốn</Text>
                <p>Hà Nội</p>
              </Col>
              <Col span={6}>
                <Text strong>Cấp bậc mong muốn</Text>
                <p>Thực tập sinh</p>
              </Col>
              <Col span={6}>
                <Text strong>Ngành nghề</Text>
                <p>UI/UX Designer</p>
              </Col>
            </Row>
          </Card>

          {/* Attached Files */}
          <Card title="Hồ sơ đính kèm">
            <Space>
              <FilePdfOutlined style={{ fontSize: 20 }} />
              <Text>CV Hà Ngọc Tú.pdf</Text>
              <Button type="link">Xem</Button>
            </Space>
            <p>Tải lên: 09/09/2020</p>
          </Card>

          {/* Skills */}
          <Card title="Kỹ năng">
            <Space wrap>
              {[
                'Figma',
                'Marketing',
                'UI/UX',
                'Graphic Design',
                'Adobe Photoshop',
                'Wireframing',
                'Prototyping',
              ].map((skill, idx) => (
                <Tag key={idx}>{skill}</Tag>
              ))}
            </Space>
          </Card>

          {/* Work Experience */}
          <Card title="Kinh nghiệm làm việc" extra={<Button type="text" icon={<PlusOutlined />} />}>
            <List
              itemLayout="vertical"
              dataSource={[
                {
                  company: 'Vietcombank',
                  position: 'Internship Designer',
                  time: '04/2024 - 12/2024',
                  description: [
                    'In-charge group project',
                    'Design website and UI/UX improve product features',
                    'Support project members with design communication',
                  ],
                },
                {
                  company: 'MBBank',
                  position: 'Internship Designer',
                  time: '04/2024 - 12/2024',
                  description: [
                    'Building consulting script and HR training process',
                    'Supporting internal communication events',
                    'Advising and guidance about suitable IT training courses',
                  ],
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Avatar shape="square" size="large">
                          {item.company[0]}
                        </Avatar>
                        <div>
                          <Text strong>{item.position}</Text>
                          <div>
                            {item.company} · {item.time}
                          </div>
                        </div>
                      </Space>
                    }
                  />
                  <ul>
                    {item.description.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </List.Item>
              )}
            />
          </Card>

          {/* Education */}
          <Card title="Học vấn" extra={<Button type="text" icon={<PlusOutlined />} />}>
            <List
              itemLayout="vertical"
              dataSource={[
                {
                  school: 'Đại học Bách khoa Hà Nội',
                  degree: 'Khoa Công nghệ thông tin',
                  time: '10/2022 - 06/2026',
                  gpa: 'GPA: 4.6',
                },
                {
                  school: 'FPT Arena',
                  degree: 'ADM',
                  time: '10/2025 - 10/2026',
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.school}</Text>}
                    description={
                      <>
                        <div>{item.degree}</div>
                        <div>{item.time}</div>
                        {item.gpa && <div>{item.gpa}</div>}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Languages */}
          <Card title="Ngoại ngữ" extra={<Button type="text" icon={<PlusOutlined />} />}>
            <p>Tiếng Anh (Elementary)</p>
          </Card>

          {/* Certificates */}
          <Card title="Bằng cấp & Chứng chỉ" extra={<Button type="text" icon={<PlusOutlined />} />}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  name: 'Certified HR OD Practitioner',
                  org: 'AHR',
                  time: '06/2024',
                },
                {
                  name: 'Talent Management & Succession Planning Specialist',
                  org: 'LinkedIn',
                  time: '10/2025 - 10/2026',
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" key="view">
                      Xem
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar>{item.org[0]}</Avatar>}
                    title={item.name}
                    description={`${item.org} · ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default StudentProfile;
