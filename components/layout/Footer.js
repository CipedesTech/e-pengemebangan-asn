import { Typography } from 'antd';

const { Text } = Typography;

function Footer() {
  return (
    <footer className='footer text-center'>
      <Text type='secondary'>
        Copyright &copy;
        {`${new Date().getFullYear()} `}
        BKPSDM Kab. Cianjur.
      </Text>
    </footer>
  );
}

export default Footer;
