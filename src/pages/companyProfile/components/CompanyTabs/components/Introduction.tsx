import React, { useState } from 'react';
import { Badge, Card, Col, Row, Space, Image, Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Introduction: React.FC<{ descHtml?: CompanyModule.Description }> = ({ descHtml }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const allImages = [
    {
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team event',
    },
    {
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team work',
    },
    {
      src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
      alt: 'Office',
    },
    {
      src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
      alt: 'Conference',
    },
    {
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team discussion',
    },
    {
      src: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Brainstorming',
    },
  ];

  // show only 3 images in preview row
  const previewImages = allImages.slice(0, 2);
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Giới thiệu công ty" className="col-span-2">
        <div dangerouslySetInnerHTML={{ __html: descHtml?.shortDescription || '<></>' }} />
        {/* Image Row */}
        <Row gutter={[16, 16]}>
          {previewImages.map((img, index) => (
            <Col key={index} xs={24} sm={8}>
              <Image
                src={img.src}
                alt={img.alt}
                style={{ borderRadius: 8, objectFit: 'cover' }}
                preview={false}
              />
            </Col>
          ))}
          <Col xs={24} sm={8}>
            <Badge count={`+${allImages.length - 2}`} offset={[-20, 20]}>
              <Image
                src={allImages[2].src}
                alt={allImages[2].alt}
                style={{ borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
                preview={false}
                onClick={() => {
                  setActiveIndex(0);
                  setIsPreviewVisible(true);
                }}
              />
            </Badge>
          </Col>
        </Row>

        {/* Fullscreen Modal */}
        <Modal
          open={isPreviewVisible}
          footer={null}
          onCancel={() => setIsPreviewVisible(false)}
          width="100%"
          style={{ top: 0, padding: 0 }}
          bodyStyle={{ padding: 0, background: '#000' }}
          centered
          closable={false}
        >
          <div style={{ textAlign: 'center', padding: 20 }}>
            {/* Main big image */}
            <Image
              src={allImages[activeIndex].src}
              alt={allImages[activeIndex].alt}
              style={{
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 8,
              }}
              preview={false}
            />

            {/* Thumbnail row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 20,
              }}
            >
              {allImages.map((img, index) => (
                <Image
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  width={100}
                  height={70}
                  style={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: activeIndex === index ? '3px solid #1890ff' : '2px solid #fff',
                    borderRadius: 4,
                  }}
                  preview={false}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </Modal>
      </Card>
      <Card className="col-span-2">
        <div dangerouslySetInnerHTML={{ __html: descHtml?.longDescription || '<></>' }} />
      </Card>
    </Space>
  );
};

export default Introduction;
