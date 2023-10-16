import ApiClient from 'utils/ApiClient';

const getAllRole = (params) => { return ApiClient.get('/api/master/role', params); };

const getRoleById = (id) => { return ApiClient.get(`/api/master/role/${id}`, {}); };

const createRole = (payload) => { return ApiClient.post('/api/master/role', payload); };

const updateRole = (id, payload) => { return ApiClient.put(`/api/master/role/${id}`, payload); };

const deleteRoleById = (id) => { return ApiClient.delete(`/api/master/role/${id}`, {}); };

export default {
  getAllRole,
  getRoleById,
  deleteRoleById,
  createRole,
  updateRole,
};
