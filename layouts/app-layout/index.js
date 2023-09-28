import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import getConfig from 'next/config';
import PropTypes from 'prop-types';

import MenuConstant from 'constants/MenuConstant.json';

import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH } from 'constants/ThemeConstant';
import { Layout, Grid, Tabs } from 'antd';
import { getBreakpoint, getRouteInfo } from 'utils/Utils';
import HeaderNav from 'components/layout/HeaderNav';
import SideNav from 'components/layout/Sidenav';
import Footer from 'components/layout/Footer';
import MobileNav from 'components/layout/MobileNav';
import { useTranslation } from 'react-i18next';

const { publicRuntimeConfig: Config } = getConfig();

const { Content } = Layout;
const { useBreakpoint } = Grid;

function AppLayout({ title, children, extra, onTab }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { sidebarCollapse } = useSelector((state) => state.theme);

  const menu = MenuConstant;
  const screens = getBreakpoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, []);

  const items = [
    {
      label: t('Jenis Perencanaan'),
      key: 'jenis',
    },
    {
      label: t('Tingkat Perancanaan'),
      key: 'tingkat',
    },
    {
      label: t('Tahapan Perancanaan'),
      key: 'tahapan',
    },
    {
      label: t('Pelaksanaan Pengembangan'),
      key: 'pelaksanaan',
    },
    {
      label: t('Evaluasi Pengembangan'),
      key: 'evaluasi',
    },
  ];

  const changeTab = (activeKey) => {
    router.push(`/pengembangan/${activeKey}`);
  };

  useEffect(() => {
    console.log('CONFIG...', Config);
    if (router?.isReady) {
      if (router?.pathname === '/') {
        setRouteInfo(getRouteInfo(menu, router.pathname));
      } else {
        const linkPath = router?.pathname.split('/');
        linkPath.shift();

        setRouteInfo(getRouteInfo(menu, `/${linkPath[0]}/${linkPath[1]}`));
      }
    }
  }, [router]);

  const getLayoutGutter = () => {
    if (isMobile) {
      return 0;
    }

    return sidebarCollapse ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;
  };

  return (
    <Layout>
      <Head>
        <title>{title} &mdash; {Config?.APP_NAME}</title>
      </Head>
      <HeaderNav isMobile={isMobile} />
      <Layout className='app-container' style={{ backgroundColor: 'white' }}>
        {(!isMobile) ? <SideNav routeInfo={routeInfo} navCollapsed={sidebarCollapse} /> : null}
        {loading ? null : (
          <Layout className='app-layout' style={{ paddingLeft: getLayoutGutter() }}>
            <div className='app-content'>
              <Tabs onChange={changeTab} type='card' items={items} activeKey={onTab} className='mx-4 mt-3' style={{ display: extra ? null : 'none' }} />
              <Content className='mt-4'>
                {children}
              </Content>
            </div>
            <Footer />
          </Layout>
        )}
      </Layout>
      {isMobile && <MobileNav routeInfo={routeInfo} />}
    </Layout>
  );
}

AppLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onTab: PropTypes.string.isRequired,
  extra: PropTypes.bool,
};

AppLayout.defaultProps = {
  extra: true,
};

export default AppLayout;
