import ApiClient from 'utils/ApiClient';

const getAll = (params) => { return ApiClient.get('/api/master/user', params); };

const getById = (id) => { return ApiClient.get(`/api/master/user/${id}`, {}); };

const create = (payload) => { return ApiClient.post('/api/master/user', payload); };

const update = (id, payload) => { return ApiClient.put(`/api/master/user/${id}`, payload); };

const deleteById = (id) => { return ApiClient.delete(`/api/master/user/${id}`, {}); };

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
