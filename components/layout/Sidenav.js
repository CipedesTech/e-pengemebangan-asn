import PropTypes from 'prop-types';

import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH } from 'constants/ThemeConstant';

import { Col, Layout, Row, Typography } from 'antd';
import MenuContent from 'components/layout/MenuContent';
import { useSelector } from 'react-redux';

const { Sider } = Layout;
const { Title } = Typography;

function SideNav({ routeInfo, navCollapsed, menuConstant }) {
  const { user } = useSelector((state) => state.auth);
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
      <MenuContent routeInfo={routeInfo} menuConstant={menuConstant} />
    </Sider>
  );
}

SideNav.propTypes = {
  routeInfo: PropTypes.objectOf(PropTypes.any),
  navCollapsed: PropTypes.bool.isRequired,
  menuConstant: PropTypes.array.isRequired,
};

SideNav.defaultProps = {
  routeInfo: {},
};

export default SideNav;
