import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Button, Space, Typography, Tag, Spin, Flex } from 'antd';
import {
  EnvironmentOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { fetchListCompanyJobs } from '@/pages/companyProfile/service';
import IconBookMark from '@/components/Icon/IconBookMark';

const { Text } = Typography;

interface JobListProps {
  id: string;
}

const JobList: React.FC<JobListProps> = ({ id }) => {
  const [jobs, setJobs] = useState<CompanyModule.Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await fetchListCompanyJobs(id, { current: 1, pageSize: 5 });
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs', err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [id]);

  return (
    <div style={{ marginTop: 32 }}>
      <Card title={`${jobs.length} việc làm đang tuyển dụng`}>
        {loading ? (
          <Spin />
        ) : (
          <List
            dataSource={jobs}
            renderItem={(job) => (
              <List.Item
                actions={[
                  <Button type="primary" key="apply">
                    Ứng tuyển
                  </Button>,
                  <Button color="default" variant="filled" style={{ borderRadius: 18, width: 36 }}>
                    <IconBookMark style={{ width: 20, height: 15, margin: -10 }} />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  //   avatar={<Avatar src={job.companyLogo || '/company-logo.png'} />}
                  avatar={
                    <Avatar
                      shape="square"
                      style={{ height: 64, width: 64 }}
                      src={job.companyAvatar || '/company-logo.png'}
                    />
                  }
                  title={
                    <Flex vertical>
                      <Text strong>{job.jobTitle}</Text>
                      <Text type="secondary">{job.location}</Text>
                    </Flex>
                  }
                  description={
                    <Space size="middle">
                      <Tag color="blue" bordered={false}>
                        <DollarOutlined /> {job.salary || 'Thoả thuận'}
                      </Tag>
                      <Tag bordered={false}>
                        <FieldTimeOutlined /> {job.jobType || 'Full time'}
                      </Tag>
                      <Tag bordered={false}>
                        <CalendarOutlined /> {job.timeLeft || 'Hà Nội'}
                      </Tag>
                      <Tag bordered={false}>
                        <EnvironmentOutlined /> {job.location || 'Hà Nội'}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="link">Xem tất cả công việc</Button>
        </div>
      </Card>
    </div>
  );
};

export default JobList;
