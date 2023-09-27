import ApiClient from 'utils/ApiClient';

const getAllPinjaman = (params) => {
  return ApiClient.get('/pinjaman/list_pinjaman', params).then((result) => result?.data);
};

const getBorrowerPinjaman = (params) => {
  return ApiClient.get('/pinjaman/list_pinjaman_borrower', params).then((result) => result?.data);
};

const getCariPinjaman = (params) => {
  return ApiClient.get('/pinjaman/cari_pinjaman/', params).then((result) => result?.data);
};

const getPinjaman = () => {
  return ApiClient.get('/pinjaman/list_pinjaman_saya').then((result) => result?.data);
};

const getDetailPinjaman = (id) => {
  return ApiClient.get(`/pinjaman/${id}`).then((result) => result?.data);
};

const putPinjaman = (payload) => {
  return ApiClient.put(`/pinjaman/${payload.id}`, payload.data).then((result) => result?.data);
};

const postPinjaman = (payload) => {
  return ApiClient.post('/pinjaman/add_pinjaman', payload.data).then((result) => result?.data);
};

export default {
  getAllPinjaman,
  getBorrowerPinjaman,
  getCariPinjaman,
  getPinjaman,
  getDetailPinjaman,
  putPinjaman,
  postPinjaman,
};
