import ApiClient from 'utils/ApiClient';

const getAll = (params) => { return ApiClient.get('/api/master/diklat', params); };

const getById = (id) => { return ApiClient.get(`/api/master/diklat/${id}`, {}); };

const create = (payload) => { return ApiClient.post('/api/master/diklat', payload); };

const update = (id, payload) => { return ApiClient.put(`/api/master/diklat/${id}`, payload); };

const deleteById = (id) => { return ApiClient.delete(`/api/master/diklat/${id}`, {}); };

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
