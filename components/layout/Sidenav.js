import PropTypes from 'prop-types';

import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH } from 'constants/ThemeConstant';

import { Col, Layout, Row, Typography } from 'antd';
import MenuContent from 'components/layout/MenuContent';
import { useSelector } from 'react-redux';

const { Sider } = Layout;
const { Title } = Typography;

function SideNav({ routeInfo, navCollapsed }) {
  const { user } = useSelector((state) => state.auth);

  function capital(string) {
    let data;
    if (string != null) {
      data = string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      data = '-';
    }
    return data;
  }

  const role = (userRole) => {
    let namaRole = '';
    if (userRole === 0) {
      namaRole = 'Peminjam';
    } else if (userRole === 1) {
      namaRole = 'Kredit Admin';
    } else if (userRole === 2) {
      namaRole = 'Kredit Analis';
    } else if (userRole === 9) {
      namaRole = 'Sales Admin';
    } else {
      namaRole = 'ASN';
    }

    return namaRole;
  };

  return (
    <Sider
      className='side-nav'
      width={SIDE_NAV_WIDTH}
      collapsedWidth={SIDE_NAV_COLLAPSED_WIDTH}
      collapsed={navCollapsed}
    >
      {!navCollapsed && (
        <Row className='mt-3' style={{ backgroundColor: '#0fa5d9', borderRadius: '4px' }}>
          <Col span={24}>
            <Title level={4} className='m-3' style={{ color: 'white' }}>{user?.role}</Title>
          </Col>
        </Row>
      )}
      <MenuContent routeInfo={routeInfo} />
    </Sider>
  );
}

SideNav.propTypes = {
  routeInfo: PropTypes.objectOf(PropTypes.any),
  navCollapsed: PropTypes.bool.isRequired,
};

SideNav.defaultProps = {
  routeInfo: {},
};

export default SideNav;
