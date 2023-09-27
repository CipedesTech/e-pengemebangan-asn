import ApiClient from 'utils/ApiClientIkiModal';

const logout = () => ApiClient.withAuth().then(
  (api) => api.delete('/api/v2/auth/logout').then((result) => result?.data),
);

export default {
  logout,
};
