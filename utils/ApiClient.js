/* eslint-disable no-param-reassign */
import axios from 'axios';
import getConfig from 'next/config';
import Cookies from './Cookies';

const { publicRuntimeConfig: Config } = getConfig();

const StatusCode = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  BadGateway: 502,
};

function handleError(error) {
  switch (error?.status) {
    case StatusCode.BadRequest:
      break;
    case StatusCode.Unauthorized:
      if (window.location.pathname !== '/auth/sign-in') {
        Cookies.clearData([]);
        localStorage.clear();
        window.location.href = '/auth/sign-in';
      }
      break;
    case StatusCode.Forbidden:
      break;
    case StatusCode.UnprocessableEntity:
      break;
    case StatusCode.NotFound:
      break;
    case StatusCode.InternalServerError:
      break;
    default:
      return;
  }
  // eslint-disable-next-line consistent-return
  return Promise.reject(error);
}

const injectToken = (config) => {
  try {
    const token = Cookies.getData('accessToken');
    const refreshToken = Cookies.getData('refreshToken');

    if (token != null) {
      config.headers['x-iki-token-access'] = token;
    }
    if (config.url === '/auth/logout') {
      config.headers['x-iki-token-refresh'] = refreshToken;
    }
    return config;
  } catch (err) {
    throw new Error(err);
  }
};

const Client = axios.create({
  /**
   * Import the config from the .env
   */
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

Client.interceptors.request.use(injectToken, (err) => Promise.reject(err));

Client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    return handleError(response);
  },
);

const requestInstance = (config) => Client.request(config);

const getInstance = (url, config) => Client.get(url, config);

const postInstance = (url, data, config) => Client.post(url, data, config);

const putInstance = (url, data, config) => Client.put(url, data, config);

const deleteInstance = (url, config) => Client.delete(url, config);

export default {
  get: getInstance,
  post: postInstance,
  put: putInstance,
  delete: deleteInstance,
  request: requestInstance,
};
