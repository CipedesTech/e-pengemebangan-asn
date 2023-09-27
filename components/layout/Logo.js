import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { Grid } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import { getBreakpoint } from 'utils/Utils';
import { SIDE_NAV_WIDTH } from 'constants/ThemeConstant';

import ThemeActions from 'stores/Theme/Actions';

const { useBreakpoint } = Grid;

const getLogoWidthGutter = (isMobile, mobileLogo) => {
  if (isMobile && !mobileLogo) {
    return 0;
  }

  return `${SIDE_NAV_WIDTH}px`;
};

const getLogoDisplay = (isMobile, mobileLogo) => {
  if (isMobile && !mobileLogo) {
    return 'd-none';
  }

  return 'logo';
};

function Logo({ mobileLogo }) {
  const dispatch = useDispatch();
  const { sidebarCollapse } = useSelector((state) => state.theme);
  const isMobile = !getBreakpoint(useBreakpoint()).includes('lg');

  const onToggle = () => {
    dispatch(ThemeActions.toggleSidebar(!sidebarCollapse));
  };

  return (
    <div
      className={`${getLogoDisplay(isMobile, mobileLogo)} ${mobileLogo ? 'pl-1' : ''}`}
      style={{ width: `${getLogoWidthGutter(isMobile, mobileLogo)}` }}
    >
      {!mobileLogo && (
        <>
          <MenuOutlined
            className='nav-icon'
            onClick={onToggle}
          />
          <Link legacyBehavior href='/'>
            <a className={mobileLogo ? 'ml-0 my-0' : 'ml-3 my-0'}>
              <img
                src='/img/protokol.jpeg'
                className='img-fluid'
                alt='Logo Aplikasi'
                style={{ height: '30px' }}
              />
            </a>
          </Link>
        </>
      )}
    </div>
  );
}

Logo.propTypes = {
  mobileLogo: PropTypes.bool,
};

Logo.defaultProps = {
  mobileLogo: false,
};

export default Logo;
