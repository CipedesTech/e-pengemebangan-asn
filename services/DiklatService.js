import ApiClient from 'utils/ApiClient';

const createPelaksanaanDiklat = (payload) => { return ApiClient.post('/api/diklat/pelaksanaan', payload); };

const getAllPelaksanaanDiklat = (params) => { return ApiClient.get('/api/diklat/pelaksanaan', params); };

const getPelaksanaanDiklatById = (id) => { console.log('THISIS ID....', id); return ApiClient.get(`/api/diklat/pelaksanaan/${id}`); };

// const getPnsById = (id) => { return ApiClient.get(`/api/pns/${id}`, {}); };

// const getAllPengajuan = (params) => { return ApiClient.get('/api/pns/pengajuan', params); };

// const updatePengajuan = (id, payload) => { return ApiClient.put(`/api/pns/pengajuan/${id}`, payload); };

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
  createDiklat: createPelaksanaanDiklat,
  getAllPelaksanaanDiklat,
  getPelaksanaanDiklatById,
  // getPnsById,
  // getAllPengajuan,
  // updatePengajuan,
  // getCariPinjaman,
  // getPinjaman,
  // getDetailPinjaman,
  // putPinjaman,
  // postPinjaman,
};
