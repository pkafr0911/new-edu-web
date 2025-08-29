import { Card, Col, Row, Typography } from 'antd';
import RegisterForm from './components/RegisterForm';
import ImageContent from './components/ImageContent';
import { useEffect, useRef, useState } from 'react';
import querystring from 'query-string';
import { isNumber } from 'lodash';

const { Paragraph } = Typography;
const RegisterIframe: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  //images
  const bannerURL = '/images/bannerRegister.png';
  const [imageMaxWidth, setImageMaxWidth] = useState<number | '100%'>('100%');
  const imgRef = useRef<HTMLImageElement>(null);
  const { lang = 'en' } = querystring.parse(location.search);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992); // Hide image on small screens
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get natural image size and set maxWidth dynamically
  useEffect(() => {
    if (imgRef.current) {
      setImageMaxWidth(imgRef.current.naturalWidth);
    }
  }, []);
  return (
    <Row style={{ minHeight: '100vh', borderRadius: '8px', backgroundColor: '#f7f7f7' }}>
      {/* Left Side - Image */}
      {!isSmallScreen && (
        <Col
          xs={0}
          lg={9}
          style={{
            position: 'relative',
            display: 'flex',
            // justifyContent: 'right',
            maxWidth: 406,
          }}
        >
          <div style={{ position: 'relative', width: '80%', maxWidth: imageMaxWidth }}>
            <div
              style={{
                position: 'absolute',
                top: '2%',
                left: '60%',
                transform: 'translate(-50%)',
                // textAlign: 'justify',
                width: 'max-content',
                maxWidth: isNumber(imageMaxWidth) ? imageMaxWidth - 80 : imageMaxWidth,
              }}
            >
              <ImageContent lang={(lang as 'en' | 'vi') || 'en'} />
            </div>
            <img
              ref={imgRef}
              src={bannerURL}
              alt="Banner"
              style={{ marginTop: -10, height: 'auto' }}
              onLoad={() => setImageMaxWidth(imgRef.current?.naturalWidth || '100%')}
            />
          </div>
        </Col>
      )}

      <Col xs={24} lg={15}>
        <Card style={{ backgroundColor: '#f7f7f7' }}>
          <RegisterForm lang={(lang as 'en' | 'vi') || 'en'} centered={true} />
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterIframe;
