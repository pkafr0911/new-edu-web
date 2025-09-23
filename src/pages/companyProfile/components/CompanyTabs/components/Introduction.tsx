import React from 'react';
import { Card, Space } from 'antd';

const Introduction: React.FC<{ descHtml?: CompanyModule.Description }> = ({ descHtml }) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Card title="Giới thiệu công ty" className="col-span-2">
      <div dangerouslySetInnerHTML={{ __html: descHtml?.shortDescription || '<></>' }} />
    </Card>
    <Card className="col-span-2">
      <div dangerouslySetInnerHTML={{ __html: descHtml?.longDescription || '<></>' }} />
    </Card>
  </Space>
);

export default Introduction;
