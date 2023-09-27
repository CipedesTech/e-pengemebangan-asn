import axios from 'axios';
import getConfig from 'next/config';

import { message } from 'antd';

import Cookies from './Cookies';

const { publicRuntimeConfig: Config } = getConfig();

const Client = axios.create({
  /**
   * Import the config from the .env
   */
  baseURL: Config.API_URL_IKIMODAL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

Client.interceptors.response.use((response) => {
  return response;
}, (error) => {
  let statusCode = 500;
  let errorMessage = 'HTTP Request Error';

  if (error?.response?.status === 500) {
    statusCode = error.response?.status || 500;
    errorMessage = error.response?.data?.message;

    message.error(`(${statusCode}) ${errorMessage}`);
  }

  if (error?.response?.status === 401) {
    localStorage.clear();
    Cookies.clearData();
    window.location.href = '/auth/sign-in';
  }

  if (error?.response?.status === 404) {
    statusCode = error.response?.status;
    errorMessage = 'Data tidak ditemukan!';

    message.error(`(${statusCode}) ${errorMessage}`);
  }

  if (error?.response?.status === 400) {
    statusCode = error.response?.status;
    errorMessage = error.response?.data?.detail || 'Bad Request';

    message.error(`(${statusCode}) ${errorMessage}`);
    // message.error('Cek kembali NIP / Kata Sandi');
  }

  if (error?.response?.status === 403) {
    statusCode = error.response?.status;
    errorMessage = error.response?.data?.detail || 'Bad Request';

    message.error(`(${statusCode}) ${errorMessage}`);
    // message.error('Harap membaca materi terlebih dahulu');
    // message.error('Aksi gagal, perhatikan baik-baik intruksi');
  }

  return error;
});

const getInstance = (url, params, config) => Client.get(url, {
  params,
  ...config,
});

const postInstance = (url, data, config) => Client.post(url, data, {
  ...config,
});

const putInstance = (url, data, config) => Client.put(url, data, {
  ...config,
});

const patchInstance = (url, data, config) => Client.patch(url, data, {
  ...config,
});

const deleteInstance = (url, config) => Client.delete(url, {
  ...config,
});

const withAuth = async () => {
  // const token = `Bearer ${session || null}`;

  const setConfig = (config) => ({
    ...config,
    headers: {
      ...config?.headers,
    },
  });

  return {
    get: (url, params, config) => getInstance(url, params, setConfig(config)),
    post: (url, data, config) => postInstance(url, data, setConfig(config)),
    put: (url, data, config) => putInstance(url, data, setConfig(config)),
    patch: (url, data, config) => patchInstance(url, data, setConfig(config)),
    delete: (url, config) => deleteInstance(url, setConfig(config)),
  };
};

export default {
  get: getInstance,
  post: postInstance,
  put: putInstance,
  patch: patchInstance,
  delete: deleteInstance,
  withAuth,
};
