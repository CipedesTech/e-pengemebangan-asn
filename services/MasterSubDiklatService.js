import ApiClient from 'utils/ApiClient';

const getAll = (params) => { return ApiClient.get('/api/master/diklat/sub', params); };

const getById = (id) => { return ApiClient.get(`/api/master/diklat/sub/${id}`, {}); };

const create = (payload) => { return ApiClient.post('/api/master/diklat/sub', payload); };

const update = (id, payload) => { return ApiClient.put(`/api/master/diklat/sub/${id}`, payload); };

const deleteById = (id) => { return ApiClient.delete(`/api/master/diklat/sub/${id}`, {}); };

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
