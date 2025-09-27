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
  BellOutlined,
} from '@ant-design/icons';

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
import { AboutMeModal, BasicInfoModal, DesiredJobModal, WorkExperienceModal } from './components';
import { colorFromName } from '@/helpers';

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

  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
  const [isDesiredJobOpen, setIsDesiredJobOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isWorkExperienceOpen, setIsWorkExperienceOpen] = useState(false);

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
    { key: 'notifications', label: 'Thông báo', icon: <BellOutlined /> },
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
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Profile Header */}
              <Card
                className="profile-header"
                extra={
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setIsBasicInfoOpen(true)}
                  />
                }
              >
                <Row gutter={16} align="middle">
                  <Col>
                    <Avatar
                      size={120}
                      src={banner?.education || undefined}
                      style={{
                        backgroundColor: colorFromName(banner?.name || '?'),
                        fontSize: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onError={() => true} // force fallback to text if image fails
                    >
                      {banner?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || '?'}
                    </Avatar>
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

              <BasicInfoModal
                open={isBasicInfoOpen}
                onCancel={() => setIsBasicInfoOpen(false)}
                initialValues={banner}
              />

              {/* Stats */}
              <Card>
                <Row gutter={16} className="stats-row">
                  <Col xs={12} md={6}>
                    <Card className="stat-card" style={{ background: '#EFF6FF' }}>
                      <Title level={4}>Đã ứng tuyển</Title>
                      <Title level={3} style={{ color: '#2563EB' }}>
                        {jobBanner?.appliedJobs ?? 0}
                      </Title>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="stat-card" style={{ background: '#FEF2F2' }}>
                      <Title level={4}>Việc làm đã lưu</Title>
                      <Title level={3} style={{ color: '#EF4444' }}>
                        {jobBanner?.savedJobs ?? 0}
                      </Title>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="stat-card" style={{ background: '#F0FDF4' }}>
                      <Title level={4}>Việc đã làm</Title>
                      <Title level={3} style={{ color: '#16A34A' }}>
                        {jobBanner?.completedJobs ?? 0}
                      </Title>
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="stat-card" style={{ background: '#FFF7ED' }}>
                      <Title level={4}>Đánh giá</Title>
                      <Title level={3} style={{ color: '#F97316' }}>
                        {jobBanner?.rating ?? '-'} ★
                      </Title>
                    </Card>
                  </Col>
                </Row>
              </Card>
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
              <Card
                title="Giới thiệu bản thân"
                extra={
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setIsAboutMeOpen(true)}
                  />
                }
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: description?.description || 'Chưa có mô tả bản thân.',
                  }}
                />
              </Card>

              <AboutMeModal
                open={isAboutMeOpen}
                onCancel={() => setIsAboutMeOpen(false)}
                initialValue={description?.description}
              />
              {/* Job Preference */}
              <Card
                title="Công việc mong muốn"
                className="profile-header"
                extra={
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setIsDesiredJobOpen(true)}
                  />
                }
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Text strong>Mức lương mong muốn</Text>
                    <p>{expectedJobs?.expectedSalary || '-'}</p>
                  </Col>
                  <Col span={8}>
                    <Text strong>Nơi làm việc mong muốn</Text>
                    <p>{expectedJobs?.expectedLocation || '-'}</p>
                  </Col>
                  <Col span={8}>
                    <Text strong>Cấp bậc mong muốn</Text>
                    <p>{expectedJobs?.level || '-'}</p>
                  </Col>
                  <Col span={8}>
                    <Text strong>Hình thức làm việc</Text>
                    <p>{expectedJobs?.expectedJobType || '-'}</p>
                  </Col>
                  <Col span={8}>
                    <Text strong>Ngành nghề</Text>
                    <p>{expectedJobs?.industry || '-'}</p>
                  </Col>
                  <Col span={8}>
                    <Text strong>Có người hướng dẫn làm việc</Text>
                    <p>{expectedJobs?.isNeedMentor || '-'}</p>
                  </Col>
                </Row>
              </Card>

              <DesiredJobModal
                open={isDesiredJobOpen}
                onCancel={() => setIsDesiredJobOpen(false)}
                initialValues={expectedJobs}
              />
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

              {/* Work Experience */}
              <Card
                title="Kinh nghiệm làm việc"
                extra={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => setIsWorkExperienceOpen(true)}
                  />
                }
              >
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

              <WorkExperienceModal
                open={isWorkExperienceOpen}
                onCancel={() => setIsWorkExperienceOpen(false)}
                // initialValues={null}
              />

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
            </Space>
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
