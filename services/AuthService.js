import ApiClient from 'utils/ApiClient';

const login = (payload) => ApiClient.post('/api/auth/login', payload.data);

const changePassword = (payload) => ApiClient.put('/api/auth/update-password', payload);

const logout = () => ApiClient.delete('/auth/logout').then((result) => result?.data);

const me = () => ApiClient.post('/api/auth/me');

export default {
  login,
  changePassword,
  logout,
  me,
};
