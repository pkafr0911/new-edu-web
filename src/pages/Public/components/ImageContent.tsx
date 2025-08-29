import { CSSProperties, useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Typography } from 'antd';
import { Helmet, useIntl, useParams } from '@umijs/max';
import Settings from '@/../config/defaultSettings';
import RegisterSuccess from '../Result/RegisterSuccess';

const { Paragraph, Title, Text } = Typography;

type Props = {
  lang?: 'en' | 'vi';
};

const ImageContent: React.FC<Props> = ({ lang }) => {
  const titleStyle: CSSProperties = { color: '#fff', fontSize: 11.6 };
  const contentStyle: CSSProperties = {
    color: '#e9e9e9',
    textAlign: 'justify',
    fontSize: 12,
    // marginBottom: -5,
  };

  //#region vietnamese
  const VNContent: React.FC = () => (
    <Space direction="vertical" size="small">
      <Text strong style={titleStyle}>{`DATA CENTER & CLOUD INFRASTRUCTURE SUMMIT 2025`}</Text>
      <Paragraph style={contentStyle}>
        Trải qua 3 năm tổ chức thành công với hơn 7.000 khách tham dự, hơn 100 diễn giả đầu ngành,
        DCCI Summit đã trở thành điểm hẹn thường niên không thể bỏ lỡ trong cộng đồng công nghệ. Đây
        là nơi các doanh nghiệp trong nước và quốc tế gặp gỡ, kết nối và cập nhật những xu hướng mới
        nhất, nóng nhất trong lĩnh vực Data Center & Cloud.
      </Paragraph>
      <Paragraph>
        <Text style={contentStyle}>
          DCCI Summit 2025 với chủ đề{' '}
          <Text style={{ color: '#3f95bd' }}>“Green Tech, Green Future”</Text> - vai trò của công
          nghệ xanh trong việc xây dựng một tương lai bền vững, sẽ diễn ra vào:
        </Text>
      </Paragraph>
      <Paragraph>
        <Text style={contentStyle}>Thời gian: 09:00 - 12:30, ngày 22/04/2025.</Text>
        <br />
        <Text style={contentStyle}>Địa điểm: Khách sạn JW Marriott Hà Nội.</Text>
      </Paragraph>
      <Paragraph>
        <Text style={contentStyle}>Bao gồm 3 phiên chuyên đề:</Text>
        <br />
        <Text style={contentStyle}>- Data Center Room</Text>
        <br />
        <Text style={contentStyle}>- Cloud Room</Text>
        <br />
        <Text style={contentStyle}>- AI Room</Text>
      </Paragraph>
    </Space>
  );
  //#endregion

  //#region english
  const ENContent: React.FC = () => (
    <Space direction="vertical" size="small">
      <Text strong style={titleStyle}>{`DATA CENTER & CLOUD INFRASTRUCTURE SUMMIT 2025`}</Text>
      <div>
        <Paragraph style={contentStyle}>
          After three successful editions, attracting over 7,000 attendees and featuring more than
          100 top industry speakers, DCCI Summit has become an unmissable annual gathering for the
          tech community. This is where local and international businesses connect, exchange ideas,
          and stay ahead of the latest and hottest trends in the Data Center & Cloud industry.
        </Paragraph>
        <Paragraph style={contentStyle}>
          DCCI Summit 2025 will take place under the theme{' '}
          <Text style={{ color: '#3f95bd' }}>“Green Tech, Green Future”</Text>, highlighting the
          role of green technology in building a sustainable future.
        </Paragraph>
        <Paragraph>
          <Text style={contentStyle}>Time: 09:00 - 12:30, April 22, 2025</Text>
          <br />
          <Text style={contentStyle}>Venue: JW Marriott Hotel Hanoi</Text>
        </Paragraph>
        <Paragraph>
          <Text style={contentStyle}>The event will feature 3 sessions:</Text>
          <br />
          <Text style={contentStyle}>- Data Center Room</Text>
          <br />
          <Text style={contentStyle}>- Cloud Room</Text>
          <br />
          <Text style={contentStyle}>- AI Room</Text>
        </Paragraph>
      </div>
    </Space>
  );
  //#endregion

  return <div>{lang === 'vi' ? <VNContent /> : <ENContent />}</div>;
};

export default ImageContent;
