import ApiClient from 'utils/ApiClient';

const getAll = (params) => { return ApiClient.get('/api/master/menu', params); };

const getById = (id) => { return ApiClient.get(`/api/master/menu/${id}`, {}); };

const create = (payload) => { return ApiClient.post('/api/master/menu', payload); };

const update = (id, payload) => { return ApiClient.put(`/api/master/menu/${id}`, payload); };

const deleteById = (id) => { return ApiClient.delete(`/api/master/menu/${id}`, {}); };

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
