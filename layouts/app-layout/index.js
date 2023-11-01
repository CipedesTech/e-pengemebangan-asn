import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import getConfig from 'next/config';
import PropTypes from 'prop-types';

import MenuConstant from 'constants/MenuConstant.json';

import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSED_WIDTH } from 'constants/ThemeConstant';
import { Layout, Grid, Tabs, Spin } from 'antd';
import { getBreakpoint, getRouteInfo } from 'utils/Utils';
import HeaderNav from 'components/layout/HeaderNav';
import SideNav from 'components/layout/Sidenav';
import Footer from 'components/layout/Footer';
import MobileNav from 'components/layout/MobileNav';
import { useTranslation } from 'react-i18next';
import MenuService from 'services/MenuService';

const { publicRuntimeConfig: Config } = getConfig();

const { Content } = Layout;
const { useBreakpoint } = Grid;

function AppLayout({ title, children, extra, onTab, extraDef }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { sidebarCollapse } = useSelector((state) => state.theme);

  // const menu = MenuConstant;
  const screens = getBreakpoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [menu, setMenu] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const res = await MenuService.getConstant();
    console.log(res.data.data);
    setMenu(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const items = {
    default: [
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
    ],
    rencanaPengembangan: [
      {
        label: 'Data Diri',
        key: 'dataDiri',
        url: '/rencana-pengembangan/data-diri',
      },
      {
        label: 'Diklat',
        key: 'diklat',
        url: '/rencana-pengembangan/diklat',
      },
    ],
  };

  const changeTab = (activeKey) => {
    const filter = items[extraDef].filter((el) => el.key === activeKey)[0];
    router.push(filter.url);
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
      <Spin spinning={loading}>
        <Layout className='app-container' style={{ backgroundColor: 'white' }}>
          {(!isMobile) ? <SideNav routeInfo={routeInfo} navCollapsed={sidebarCollapse} menuConstant={menu} /> : null}
          {loading ? null : (
            <Layout className='app-layout' style={{ paddingLeft: getLayoutGutter() }}>
              <div className='app-content'>
                <Tabs onChange={changeTab} type='card' items={items[extraDef]} activeKey={onTab} className='mx-4 mt-3' style={{ display: extra ? null : 'none' }} />
                <Content className='mt-4'>
                  {children}
                </Content>
              </div>
              <Footer />
            </Layout>
          )}
        </Layout>
      </Spin>
      {isMobile && <MobileNav routeInfo={routeInfo} />}
    </Layout>
  );
}

AppLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onTab: PropTypes.string.isRequired,
  extra: PropTypes.bool,
  extraDef: PropTypes.string,
};

AppLayout.defaultProps = {
  extra: true,
  extraDef: 'default',
};

export default AppLayout;
