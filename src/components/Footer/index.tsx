import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return <DefaultFooter copyright={`${new Date().getFullYear()} Copyright: New Edu.`} />;
};

export default Footer;
