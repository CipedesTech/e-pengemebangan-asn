import nookies from 'nookies';
import getConfig from 'next/config';

const { publicRuntimeConfig: Config } = getConfig();

// Note: ctx or context is required when you call this function on SSR
const options = { path: '/', domain: Config.COOKIES_DOMAIN };
// const cookiesPrefix = Config.APP_ENVIRONMENT;

const getCookiesName = (name) => `${name}`;

const setData = (name, cookies, ctx) => {
  nookies.set(ctx || null, getCookiesName(name), cookies, options);
};

const getData = (name, ctx) => {
  const cookies = nookies.get(ctx || null, options);
  return cookies?.[getCookiesName(name)];
};

const clearData = async (ctx) => {
  nookies.destroy(ctx || null, getCookiesName('token'), options);
  nookies.destroy(ctx || null, getCookiesName('refreshToken'), options);
};

export default {
  getCookiesName,
  setData,
  getData,
  clearData,
};
