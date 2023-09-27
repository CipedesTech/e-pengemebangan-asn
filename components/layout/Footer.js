import { Typography } from 'antd';

const { Text } = Typography;

function Footer() {
  return (
    <footer className='footer text-center'>
      <Text type='secondary'>
        Copyright &copy;
        {`${new Date().getFullYear()} `}
        PT. IKI Karunia Indonesia. All rights reserved.
      </Text>
    </footer>
  );
}

export default Footer;
