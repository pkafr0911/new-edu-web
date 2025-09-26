import React, { useState } from 'react';
import { Segmented, Space } from 'antd';
import { GeneralInfo, Introduction, JobList } from './components';
import Reviews from './components/Reviews';

const CompanyTabs: React.FC<{
  id: string;
  intro?: CompanyModule.Introduction;
  descHtml?: CompanyModule.Description;
}> = ({ id, intro, descHtml }) => {
  const [activeTab, setActiveTab] = useState<string>('Giới thiệu');

  return (
    <div className="company-tabs">
      <Segmented
        options={['Giới thiệu', 'Đánh giá']}
        value={activeTab}
        onChange={(val) => setActiveTab(val as string)}
        style={{ marginBottom: 24 }}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        {activeTab === 'Giới thiệu' && (
          <>
            <GeneralInfo intro={intro} />
            <Introduction descHtml={descHtml} />
            <JobList id={id} />
          </>
        )}
        {activeTab === 'Đánh giá' && <Reviews />}
      </Space>
    </div>
  );
};

export default CompanyTabs;
