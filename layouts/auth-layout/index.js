import Head from 'next/head';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

import { Row, Col } from 'antd';

const { publicRuntimeConfig: Config } = getConfig();

const backgroundStyle = {
  // backgroundColor: 'linear-gradient(89.68deg, #DE0000 -1.66%, #B20000 99.66%)',
  background: 'linear-gradient(#0fa5d9, #f8f21c)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

function AuthLayout({ title, children }) {
  return (
    <div className='auth-container'>
      <Head>
        <title>{title} &mdash; {Config?.APP_NAME}</title>
      </Head>
      <div className='h-100 bg-white'>
        <Row justify='center' className='align-items-stretch h-100'>
          <Col xs={0} sm={0} md={0} lg={12}>
            <div className='d-flex flex-column justify-content-between h-100 px-4' style={backgroundStyle} />
          </Col>
          <Col xs={20} sm={20} md={24} lg={12}>
            <div className='container d-flex flex-column justify-content-center form-auth'>
              {children}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
