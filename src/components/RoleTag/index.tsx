import { SYSTEM_ROLE } from '@/consants';
import { Tag } from 'antd';
import React from 'react';

type Props = {
  role_id: number;
};

const RoleTag: React.FC<Props> = ({ role_id }) => {
  switch (role_id) {
    case 1:
      return <Tag color={'gold'}>{SYSTEM_ROLE[role_id]}</Tag>;
    case 2:
      return <Tag color={'cyan'}>{SYSTEM_ROLE[role_id]}</Tag>;
    case 3:
      return <Tag color={'default'}>{SYSTEM_ROLE[role_id]}</Tag>;

    default:
      break;
  }
};

export default RoleTag;
