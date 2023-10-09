/* eslint-disable react/forbid-prop-types */

import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useRouter } from 'next/router';
import { PersistGate } from 'redux-persist/integration/react';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';
import Head from 'next/head';
import getConfig from 'next/config';

import NProgress from 'nprogress';

import createStore from 'stores';

import 'locales/i18n';
import { message } from 'antd';

const { publicRuntimeConfig: Config } = getConfig();

function App({ Component, pageProps }) {
  const router = useRouter();
  const store = useStore();
  const getLayout = Component.getLayout || ((page) => page);

  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
  }, [router]);

  useEffect(() => {
    if (!token && !router.pathname.includes('auth')) {
      message.error('sesi telah habis silahkan login kembali');
      router.push('/auth/sign-in');
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>{Config?.APP_NAME}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PersistGate
        loading={null}
        persistor={store.__persistor}
      >
        {getLayout(<Component {...pageProps} />)}
      </PersistGate>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.any.isRequired,
};

const makeStore = () => {
  const { store } = createStore();
  return store;
};

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(App);
