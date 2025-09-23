import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Button, Space, Typography, Tag, Spin } from 'antd';
import { EnvironmentOutlined, FieldTimeOutlined, DollarOutlined } from '@ant-design/icons';
import { fetchListCompanyJobs } from '../../../service';

const { Text } = Typography;

interface JobListProps {
  companyId: string;
}

const JobList: React.FC<JobListProps> = ({ companyId }) => {
  const [jobs, setJobs] = useState<CompanyModule.Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await fetchListCompanyJobs({ companyId, current: 1, pageSize: 5 });
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs', err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [companyId]);

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
                ]}
              >
                <List.Item.Meta
                  //   avatar={<Avatar src={job.companyLogo || '/company-logo.png'} />}
                  avatar={<Avatar src={'/company-logo.png'} />}
                  title={<Text strong>{job.companyName}</Text>}
                  description={
                    <Space size="middle">
                      <Tag color="blue">
                        <DollarOutlined /> {job.salary || 'Thoả thuận'}
                      </Tag>
                      <Tag>
                        <FieldTimeOutlined /> {job.jobType || 'Full time'}
                      </Tag>
                      <Tag>
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
