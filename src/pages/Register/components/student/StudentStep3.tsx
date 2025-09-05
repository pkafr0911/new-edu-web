import React, { useState } from 'react';
import { Form, Button, FormInstance, Typography, Tag, Flex } from 'antd';
import { message } from 'antd/lib';

type Props = {
  form: FormInstance;
  onNext?: (values: any) => void;
  onPrevious?: (values: any) => void;
};

const { Title } = Typography;

const StudentStep3: React.FC<Props> = ({ form, onNext, onPrevious }) => {
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);

  const [interestedTopicsList] = useState<{ name: string; id: number }[]>([
    { name: 'Web development', id: 1 },
    { name: 'Marketing', id: 2 },
    { name: 'Graphic Design', id: 3 },
    { name: 'Video Editing', id: 4 },
    { name: 'Copywriting', id: 5 },
    { name: 'Data Analysis', id: 6 },
    { name: 'Coaching', id: 7 },
    { name: 'Business Consulting', id: 8 },
    { name: 'SEO', id: 9 },
    { name: 'Brand Identity', id: 10 },
  ]);

  const handleFinish = (values: any) => {
    if (onNext && selectedTopics.length > 0) {
      onNext({
        interestedTopics: selectedTopics,
      });
    } else {
      message.warning('Hãy chọn ít nhất 1 chủ đề ở dưới');
    }
  };

  const handleChange = (id: number, checked: boolean) => {
    setSelectedTopics((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Title level={3}>
        Hãy giúp chúng tôi cá nhân hóa trải nghiệm của bạn tốt hơn trên NewEdu!
      </Title>

      <Flex gap="8px 0" wrap>
        {interestedTopicsList.map((item) => {
          const isChecked = selectedTopics.includes(item.id);
          return (
            <Tag.CheckableTag
              key={item.id}
              checked={isChecked}
              onChange={(checked) => handleChange(item.id, checked)}
              style={{
                padding: '6px 14px',
                fontSize: 14,
                cursor: 'pointer',
                border: isChecked ? '1px solid #000' : '1px solid #d9d9d9',
                backgroundColor: isChecked ? '#000' : '#fff',
                color: isChecked ? '#fff' : '#000',
                transition: 'all 0.2s ease',
              }}
            >
              {item.name}
            </Tag.CheckableTag>
          );
        })}
      </Flex>

      <div style={{ marginTop: 24 }}>
        <Button onClick={onPrevious}>← Quay lại</Button>
        <Button
          type="primary"
          htmlType="submit"
          style={{ float: 'right', backgroundColor: '#2563EB' }}
        >
          Tiếp tục →
        </Button>
      </div>
    </Form>
  );
};

export default StudentStep3;
