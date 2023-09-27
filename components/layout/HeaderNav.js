import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from 'components/layout/Logo';
// import NavLanguage from 'components/layout/NavLanguage';
import NavProfile from 'components/layout/NavProfile';

import { SIDE_NAV_WIDTH } from 'constants/ThemeConstant';

import ThemeActions from 'stores/Theme/Actions';

const { Header } = Layout;

function HeaderNav({ isMobile }) {
  const { mobileNav } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const getNavWidth = () => {
    if (isMobile) {
      return '0px';
    }

    return `${SIDE_NAV_WIDTH}px`;
  };

  const onToggle = () => {
    dispatch(ThemeActions.toggleMobileNav(!mobileNav));
  };

  return (
    <Header className='app-header'>
      <div className='app-header-wrapper'>
        <Logo />
        <div className='nav' style={{ width: `calc(100% - ${getNavWidth()})` }}>
          {isMobile ? (
            <div className='nav-left'>
              <ul className='ant-menu ant-menu-root ant-menu-horizontal'>
                <li className='ant-menu-item ant-menu-item-only-child' key='toggle'>
                  <MenuOutlined className='nav-icon' onClick={onToggle} />
                </li>
              </ul>
            </div>
          ) : null}
          <div className='nav-right'>
            {/* <NavLanguage /> */}
            <NavProfile />
          </div>
        </div>
      </div>
    </Header>
  );
}

HeaderNav.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

export default HeaderNav;
