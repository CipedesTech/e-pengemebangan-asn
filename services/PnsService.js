import ApiClient from 'utils/ApiClient';

const getAllPns = (params) => { return ApiClient.get('/api/pns', params); };

const getPnsById = (id) => { return ApiClient.get(`/api/pns/${id}`, {}); };

const getAllPengajuan = (params) => { return ApiClient.get('/api/pns/pengajuan', params); };

const getAllPengajuanVerif = (params) => { return ApiClient.get('/api/pns/pengajuan/verified', params); };

const createPengajuan = (payload) => { return ApiClient.post('/api/pns/pengajuan', payload); };

const updatePengajuan = (id, payload) => { return ApiClient.put(`/api/pns/pengajuan/${id}`, payload); };

const getPengajuan = (id) => { return ApiClient.get(`/api/pns/pengajuan/${id}`, {}); };

const updateCandidatePengajuan = (payload) => { return ApiClient.put('api/pns/pengajuan/update-candidate', payload); };

const updateCandidatePengajuanFromEdit = (payload) => { return ApiClient.put('api/pns/pengajuan/update-candidate-edit', payload); };

const updateCandidatePengajuanKehadiran = (payload) => { return ApiClient.put('api/pns/pengajuan/update-candidate-kehadiran', payload); };

// const getBorrowerPinjaman = (params) => {
//   return ApiClient.get('/pinjaman/list_pinjaman_borrower', params).then((result) => result?.data);
// };

// const getCariPinjaman = (params) => {
//   return ApiClient.get('/pinjaman/cari_pinjaman/', params).then((result) => result?.data);
// };

// const getPinjaman = () => {
//   return ApiClient.get('/pinjaman/list_pinjaman_saya').then((result) => result?.data);
// };

// const getDetailPinjaman = (id) => {
//   return ApiClient.get(`/pinjaman/${id}`).then((result) => result?.data);
// };

// const putPinjaman = (payload) => {
//   return ApiClient.put(`/pinjaman/${payload.id}`, payload.data).then((result) => result?.data);
// };

// const postPinjaman = (payload) => {
//   return ApiClient.post('/pinjaman/add_pinjaman', payload.data).then((result) => result?.data);
// };

export default {
  getAllPns,
  getPnsById,
  getAllPengajuan,
  getAllPengajuanVerif,
  createPengajuan,
  updatePengajuan,
  updateCandidatePengajuan,
  updateCandidatePengajuanFromEdit,
  updateCandidatePengajuanKehadiran,
  getPengajuan,
  // getCariPinjaman,
  // getPinjaman,
  // getDetailPinjaman,
  // putPinjaman,
  // postPinjaman,
};
