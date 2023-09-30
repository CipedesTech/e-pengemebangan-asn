import ApiClient from 'utils/ApiClient';

const login = (payload) => ApiClient.post('/api/auth/login', payload.data);

const logout = () => {
  return ApiClient.delete('/auth/logout').then((result) => result?.data);
};

const forgotPassword = (payload) => ApiClient.post('/auth/forgot-password/send-email/', payload.data).then((result) => result?.data);

const resetPassword = (payload) => ApiClient.post('/auth/forgot-password/change-password/', payload.data).then((result) => result?.data);

// const getProfile = () => ApiClient.withAuth().then(
//   (api) => api.get('/auth/me').then((result) => result?.data),
// );

const getMenu = () => ApiClient.withAuth().then(
  (api) => api.get('/auth/menu').then((result) => result?.data),
);

const getPermission = () => ApiClient.withAuth().then(
  (api) => api.get('/auth/permissions').then((result) => result?.data),
);

const updateProfile = (payload) => ApiClient.withAuth().then(
  (api) => api.put('/auth/me', payload.data).then((result) => result?.data),
);

const changePassword = (payload) => ApiClient.withAuth().then(
  (api) => api.post('/auth/change-password', payload.data).then((result) => result?.data),
);

export default {
  login,
  forgotPassword,
  resetPassword,
  getMenu,
  getPermission,
  updateProfile,
  changePassword,
  logout,
};
