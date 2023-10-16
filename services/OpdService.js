import ApiClient from 'utils/ApiClient';

const getAll = (params) => { return ApiClient.get('/api/master/opd', params); };

const getById = (id) => { return ApiClient.get(`/api/master/opd/${id}`, {}); };

const create = (payload) => { return ApiClient.post('/api/master/opd', payload); };

const update = (id, payload) => { return ApiClient.put(`/api/master/opd/${id}`, payload); };

const deleteById = (id) => { return ApiClient.delete(`/api/master/opd/${id}`, {}); };

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
