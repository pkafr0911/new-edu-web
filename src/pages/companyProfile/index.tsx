import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import dayjs from 'dayjs';

import { fetchCompanyBanner, fetchCompanyDescription, fetchCompanyIntroduction } from './service';
import { Banner, CompanyTabs } from './components';
import './styles.less';

const { Content } = Layout;

const CompanyProfile: React.FC = () => {
  const [banner, setBanner] = useState<CompanyModule.Banner>();
  const [intro, setIntro] = useState<CompanyModule.Introduction>();
  const [descHtml, setDescHtml] = useState<CompanyModule.Description>();
  const [loading, setLoading] = useState<boolean>(true);

  // fake uuid
  const id = 'de0a1d3b-5501-4fa3-a0c2-0be4b0c45db0';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [intro, desc, banner] = await Promise.all([
          fetchCompanyIntroduction(id),
          fetchCompanyDescription(id),
          fetchCompanyBanner(id),
        ]);
        setIntro(intro);
        setDescHtml(desc);
        setBanner(banner);
      } catch (error) {
        console.error('Error fetching company data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content>
      <Banner banner={banner} />
      <CompanyTabs id={id} intro={intro} descHtml={descHtml} />
    </Content>
  );
};

export default CompanyProfile;
