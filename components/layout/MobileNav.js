import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Drawer, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Logo from 'components/layout/Logo';
import MenuContent from 'components/layout/MenuContent';

import ThemeActions from 'stores/Theme/Actions';

function MobileNav({ routeInfo }) {
  const dispatch = useDispatch();
  const { mobileNav } = useSelector((state) => state.theme);

  const onClose = () => {
    dispatch(ThemeActions.toggleMobileNav(false));
  };

  return (
    <Drawer
      placement='left'
      closable={false}
      onClose={onClose}
      open={mobileNav}
      bodyStyle={{ padding: 14 }}
      width={300}
    >
      <div className='d-flex flex-column h-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <Logo mobileLogo />
          <Button size='small' type='text' onClick={() => onClose()}>
            <CloseOutlined />
          </Button>
        </div>
        <div className='mobile-nav-menu'>
          <MenuContent routeInfo={routeInfo} />
        </div>
      </div>
    </Drawer>
  );
}

MobileNav.propTypes = {
  routeInfo: PropTypes.objectOf(PropTypes.any),
};

MobileNav.defaultProps = {
  routeInfo: {},
};

export default MobileNav;
