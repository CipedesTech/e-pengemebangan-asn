import ApiClient from 'utils/ApiClient';

const login = (payload) => ApiClient.post('/api/auth/login', payload.data);

const logout = () => ApiClient.delete('/auth/logout').then((result) => result?.data);

export default {
  login,
  logout,
};
