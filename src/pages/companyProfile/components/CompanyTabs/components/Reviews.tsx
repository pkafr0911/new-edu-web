import React from 'react';
import { Card, List, Rate, Space, Typography, Avatar, Progress } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const Reviews: React.FC = () => {
  // sample data
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

  return (
    <>
      {/* Rating Overview */}
      <Card title="Đánh giá tổng quan" className="col-span-1">
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
    </>
  );
};

export default Reviews;
