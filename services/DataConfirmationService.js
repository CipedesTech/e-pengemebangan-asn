import ApiClient from 'utils/ApiClient';

// borrower
const getListPertanyaanBorrower = (payload) => {
  return ApiClient.get(`/konfirmasi_data/${payload.id}/list_pertanyaan_sendiri`, payload.params).then((result) => result?.data);
};

const putAddJawabanBorrower = (payload) => {
  return ApiClient.put(`/konfirmasi_data/jawab_pertanyaan/${payload.id}`, payload.data).then((result) => result?.data);
};

const postUploadFileBorrower = (payload) => {
  return ApiClient.post(`/konfirmasi_data/jawab_pertanyaan/upload_file/${payload.id}`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const postUpdateFileBorrower = (payload) => {
  return ApiClient.post(`/konfirmasi_data/jawab_pertanyaan/edit_file/${payload.id}`, payload.data).then((result) => result?.data);
};

// admin analyst
const postPertanyaanAnalyst = (payload) => {
  return ApiClient.post(`/konfirmasi_data/buat_pertanyaan/${payload.id}`, payload.data).then((result) => result?.data);
};

const putJawabanAnalyst = (payload) => {
  return ApiClient.put(`/konfirmasi_data/edit_pertanyaan/${payload.id}`, payload.data).then((result) => result?.data);
};

const getVerifikasiAnalyst = (payload) => {
  return ApiClient.get(`/konfirmasi_data/admin/lihat_verifikasi/${payload.id}`, payload.params).then((result) => result?.data);
};

const getDokumenVerifikasiAnalyst = (payload) => {
  return ApiClient.get(`/konfirmasi_data/lihat_dokumen/${payload.id}`, payload.params).then((result) => result?.data);
};

const getPertanyaanAnalyst = (payload) => {
  return ApiClient.get(`/konfirmasi_data/${payload.id}/list_pertanyaan`, payload.params).then((result) => result?.data);
};

const putApprovalDokumen = (payload) => {
  return ApiClient.put('/konfirmasi_data/admin/approval_dokumen', payload.data).then((result) => result?.data);
};

const postApproveAnalyst = (payload) => {
  return ApiClient.post('/konfirmasi_data/approve_by_analyst', payload.data).then((result) => result?.data);
};

const postApproveAnalystDataSubmission = (payload) => {
  return ApiClient.post('/konfirmasi_data/approve_by_analyst/bypass', payload.data).then((result) => result?.data);
};

const deleteFilePertanyaan = (payload) => {
  return ApiClient.delete('/konfirmasi_data/admin/hapus_file', payload).then((result) => result?.data);
};

export default {
  getListPertanyaanBorrower,
  putAddJawabanBorrower,
  postUploadFileBorrower,
  postUpdateFileBorrower,

  postPertanyaanAnalyst,
  putJawabanAnalyst,
  getVerifikasiAnalyst,
  getDokumenVerifikasiAnalyst,
  getPertanyaanAnalyst,
  putApprovalDokumen,
  postApproveAnalyst,
  postApproveAnalystDataSubmission,
  deleteFilePertanyaan,
};
