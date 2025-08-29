import { Helmet, history } from '@umijs/max';
import RegisterForm from './components/RegisterForm';
import Settings from '@/../config/defaultSettings';
import { Card, Flex } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';

const Register: React.FC = () => {
  const callback = (data: { action: string; data?: any }) => {
    if (data.action === 'register') {
      history.push(
        `/public/confirm-check-in/${data.data.summit_id}?check_in_code=${data.data.check_in_code}`,
      );
    }
  };
  return (
    <Flex justify="center" align="center">
      <Card
        className="w-full max-w-lg p-6 shadow-lg border border-gray-300 text-center"
        title={
          <div className="flex items-center justify-center text-xl font-semibold">
            <UserAddOutlined className="text-green-500 mr-2" /> Register
          </div>
        }
        style={{ width: '100%', maxWidth: 800 }}
      >
        <RegisterForm lang="en" callback={callback} />
      </Card>
    </Flex>
  );
};

export default Register;
