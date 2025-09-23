import React from 'react';
import { Card, Row, Col } from 'antd';
import { ClockCircleOutlined, TeamOutlined, GlobalOutlined, BankOutlined } from '@ant-design/icons';

const GeneralInfo: React.FC<{ intro?: CompanyModule.Introduction }> = ({ intro }) => (
  <Card title="Thông tin chung">
    <Row gutter={[24, 16]}>
      <Col xs={24} sm={12} md={6}>
        <div className="info-item">
          <ClockCircleOutlined className="info-icon" />
          <div>
            <div className="info-label">Thời gian làm việc</div>
            <div className="info-value">{intro?.workingHours}</div>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <div className="info-item">
          <TeamOutlined className="info-icon" />
          <div>
            <div className="info-label">Quy mô công ty</div>
            <div className="info-value">{intro?.companyScale}</div>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <div className="info-item">
          <GlobalOutlined className="info-icon" />
          <div>
            <div className="info-label">Quốc gia</div>
            <div className="info-value">{intro?.location}</div>
          </div>
        </div>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <div className="info-item">
          <BankOutlined className="info-icon" />
          <div>
            <div className="info-label">Lĩnh vực</div>
            <div className="info-value">{intro?.industry}</div>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);

export default GeneralInfo;
