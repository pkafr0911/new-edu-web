import React, { useEffect, useState } from 'react';
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
  Spin,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BookOutlined,
  FilePdfOutlined,
  EditOutlined,
  PlusOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './styles.less';

import {
  fetchStudentBanner,
  fetchStudentSkills,
  fetchStudentExpectedJobs,
  fetchStudentEducation,
  fetchStudentDescription,
  fetchStudentCertificates,
  fetchStudentJobBanner,
} from './service';
import './styles.less';

const { Content } = Layout;
const { Title, Text } = Typography;

const StudentProfile: React.FC = () => {
  const id = '2403f28d-a9e5-49a5-b001-e08eed0b411e';

  // ✅ States for all data sections
  const [banner, setBanner] = useState<StudentModule.BannerData>();
  const [skills, setSkills] = useState<StudentModule.StudentSkillsData>();
  const [expectedJobs, setExpectedJobs] = useState<StudentModule.ExpectedJobsData>();
  const [education, setEducation] = useState<StudentModule.EducationItem[]>([]);
  const [description, setDescription] = useState<StudentModule.DescriptionData>();
  const [certificates, setCertificates] = useState<StudentModule.CertificateItem[]>([]);
  const [jobBanner, setJobBanner] = useState<StudentModule.JobBannerData>();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>('overview');

  // ✅ Fetch all profile data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          bannerData,
          skillsData,
          expectedJobsData,
          educationRes,
          descriptionData,
          certificatesData,
          jobBannerData,
        ] = await Promise.all([
          fetchStudentBanner(id),
          fetchStudentSkills(id),
          fetchStudentExpectedJobs(id),
          fetchStudentEducation(id, { current: 1, pageSize: 5 }),
          fetchStudentDescription(id),
          fetchStudentCertificates(id),
          fetchStudentJobBanner(id),
        ]);

        setBanner(bannerData);
        setSkills(skillsData);
        setExpectedJobs(expectedJobsData);
        setEducation(educationRes.data);
        setDescription(descriptionData);
        setCertificates(certificatesData);
        setJobBanner(jobBannerData);
      } catch (error) {
        console.error('Failed to fetch student profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const sidebarItems = [
    { key: 'overview', label: 'Tổng quan', icon: <AppstoreOutlined /> },
    { key: 'my-jobs', label: 'Việc làm của tôi', icon: <ProfileOutlined /> },
    { key: 'companies', label: 'Nhà tuyển dụng/Công ty', icon: <TeamOutlined /> },
    { key: 'invitations', label: 'Lời mời công việc', icon: <MailOutlined /> },
    { key: 'notifications', label: 'Thông báo', icon: <MailOutlined /> },
    { key: 'settings', label: 'Cài đặt', icon: <SettingOutlined /> },
  ];

  return (
    <Content className="student-profile">
      <Row gutter={24}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Card className="sidebar-card">
            <Title level={4}>Tài khoản</Title>
            <List
              itemLayout="horizontal"
              dataSource={sidebarItems}
              renderItem={(item) => (
                <List.Item
                  className={item.key === activeTab ? 'active' : ''}
                  onClick={() => setActiveTab(item.key)}
                >
                  <Space>
                    {item.icon}
                    <span>{item.label}</span>
                  </Space>
                </List.Item>
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
          {/* Overview Section */}
          {activeTab === 'overview' && (
            <>
              {/* Profile Header */}
              <Card className="profile-header" extra={<Button icon={<EditOutlined />}>Sửa</Button>}>
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar size={96} src={banner?.education || undefined} />
                  </Col>
                  <Col flex="auto">
                    <Title level={4}>{banner?.name}</Title>
                    <Space direction="vertical" size={4}>
                      <Text>
                        <PhoneOutlined /> {banner?.phoneNumber}
                      </Text>
                      <Text>
                        <MailOutlined /> {banner?.email}
                      </Text>
                      <Text>
                        <EnvironmentOutlined /> {banner?.location}
                      </Text>
                      <Text>
                        <BookOutlined /> {banner?.education}
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
              {/* Stats */}
              <Row gutter={16} className="stats-row">
                <Col xs={12} md={6}>
                  <Card className="stat-card">
                    <Title level={4}>{jobBanner?.appliedJobs ?? 0}</Title>
                    <Text>Đã ứng tuyển</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card className="stat-card">
                    <Title level={4}>{jobBanner?.savedJobs ?? 0}</Title>
                    <Text>Việc làm đã lưu</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card className="stat-card">
                    <Title level={4}>{jobBanner?.completedJobs ?? 0}</Title>
                    <Text>Việc đã làm</Text>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card className="stat-card">
                    <Title level={4}>{jobBanner?.rating ?? '-'}</Title>
                    <Text>Đánh giá</Text>
                  </Card>
                </Col>
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: description?.description || 'Chưa có mô tả bản thân.',
                  }}
                />
              </Card>
              {/* Job Preference */}
              <Card title="Công việc mong muốn">
                <Row gutter={16}>
                  <Col span={6}>
                    <Text strong>Mức lương mong muốn</Text>
                    <p>{expectedJobs?.expectedSalary || '-'}</p>
                  </Col>
                  <Col span={6}>
                    <Text strong>Nơi làm việc mong muốn</Text>
                    <p>{expectedJobs?.expectedLocation || '-'}</p>
                  </Col>
                  <Col span={6}>
                    <Text strong>Cấp bậc mong muốn</Text>
                    <p>{expectedJobs?.level || '-'}</p>
                  </Col>
                  <Col span={6}>
                    <Text strong>Ngành nghề</Text>
                    <p>{expectedJobs?.industry || '-'}</p>
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
                  {skills?.skills?.length ? (
                    skills.skills.map((skill, idx) => <Tag key={idx}>{skill}</Tag>)
                  ) : (
                    <Text type="secondary">Chưa có kỹ năng nào</Text>
                  )}
                </Space>
              </Card>
              {/* Education */}
              <Card title="Học vấn" extra={<Button type="text" icon={<PlusOutlined />} />}>
                <List
                  itemLayout="vertical"
                  dataSource={education}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          item.universityAvatarUrl && (
                            <Avatar src={item.universityAvatarUrl} shape="square" />
                          )
                        }
                        title={<Text strong>{item.universityName}</Text>}
                        description={
                          <>
                            <div>{item.division}</div>
                            <div>
                              {item.startTime} - {item.endTime}
                            </div>
                            <div>GPA: {item.gpa}</div>
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
              <Card
                title="Bằng cấp & Chứng chỉ"
                extra={<Button type="text" icon={<PlusOutlined />} />}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={certificates}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link" key="view">
                          Xem
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          item.certificateAvatarUrl && (
                            <Avatar src={item.certificateAvatarUrl} shape="square" />
                          )
                        }
                        title={item.certificateName}
                        description={`${item.issuer} · ${item.issueDate}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </>
          )}

          {activeTab === 'my-jobs' && (
            <Card>
              <Title level={4}>📁 Việc làm của tôi</Title>
              <p>Danh sách các công việc bạn đã ứng tuyển sẽ xuất hiện ở đây...</p>
            </Card>
          )}

          {activeTab === 'companies' && (
            <Card>
              <Title level={4}>🏢 Nhà tuyển dụng / Công ty</Title>
              <p>Thông tin nhà tuyển dụng bạn đã tương tác...</p>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <Title level={4}>⚙️ Cài đặt tài khoản</Title>
              <p>Thay đổi thông tin cá nhân, bảo mật, và tùy chỉnh tài khoản tại đây.</p>
            </Card>
          )}
        </Col>
      </Row>
    </Content>
  );
};

export default StudentProfile;
