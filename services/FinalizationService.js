import ApiClient from 'utils/ApiClient';

// borrower
const getPertanyaanLenderApproval = (id) => {
  return ApiClient.get(`/finalisasi/lender_approval/lihat_pertanyaan/${id}`).then((result) => result?.data);
};

const getPertanyaanAkadCredit = (id) => {
  return ApiClient.get(`/finalisasi/akad_credit/lihat_pertanyaan/${id}`).then((result) => result?.data);
};

const getFinalisasiBorrower = (id) => {
  return ApiClient.get(`/finalisasi/detail_finalisasi/${id}`).then((result) => result?.data);
};

const getDokumenBorrower = (id) => {
  return ApiClient.get(`/finalisasi/list_dokumen/${id}`).then((result) => result?.data);
};

const getDokumenAdmin = (id) => {
  return ApiClient.get(`/finalisasi/admin/list_dokumen/${id}`).then((result) => result?.data);
};

const putJawabanLenderApproval = (payload) => {
  return ApiClient.put(`/finalisasi/lender_approval/jawab_pertanyaan/${payload.id}`, payload.data).then((result) => result?.data);
};

const putJawabanAkadKredit = (payload) => {
  return ApiClient.put(`/finalisasi/akad_credit/jawab_pertanyaan/${payload.id}`, payload.data).then((result) => result?.data);
};

const postUploadFileLenderApproval = (payload) => {
  return ApiClient.post(`/finalisasi/lender_approval/${payload.id}/upload_file`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const postUploadFileAkadKreditBorrower = (payload) => {
  return ApiClient.post(`/finalisasi/akad_credit/${payload.id}/upload_file`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const postUploadFileAkadKreditBorrowerOSS = (payload) => {
  return ApiClient.post('/finalisasi/oss', payload.data, { headers: {
  } }).then((result) => result?.data);
};

// admin
const getFinalisasiAdmin = (id) => {
  return ApiClient.get(`/finalisasi/admin/detail_finalisasi/${id}`).then((result) => result?.data);
};

const putApprovalDocumentComitee = (payload) => {
  return ApiClient.put('finalisasi/admin/credit_commite/approval_dokumen', payload.data).then((result) => result?.data);
};

const postUploadFileCommitee = (payload) => {
  return ApiClient.post(`/finalisasi/credit_commite/${payload.id}/upload_file`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const postUploadFactSheetLender = (payload) => {
  return ApiClient.post(`/finalisasi/admin/lender_approval/${payload.id}/upload_factsheet`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const putStatusAdmin = (payload) => {
  return ApiClient.put(`/finalisasi/admin/update_status/${payload.id}`, payload.data).then((result) => result?.data);
};

const putSigningNotes = (payload) => {
  return ApiClient.put(`/finalisasi/admin/signing_notes/${payload.id}`, payload.data).then((result) => result?.data);
};

const putApproveDokumenLender = (payload) => {
  return ApiClient.put('/finalisasi/admin/lender_approval/approval_dokumen', payload.data).then((result) => result?.data);
};

const putApproveDokumenAkad = (payload) => {
  return ApiClient.put('/finalisasi/admin/akad_credit/approval_dokumen', payload.data).then((result) => result?.data);
};

const postPertanyaanLenderApproval = (payload) => {
  return ApiClient.post(`/finalisasi/admin/lender_approval/${payload.id}/buat_pertanyaan`, payload.data).then((result) => result?.data);
};

const postPertanyaanAkadKredit = (payload) => {
  return ApiClient.post(`/finalisasi/admin/akad_credit/${payload.id}/buat_pertanyaan`, payload.data).then((result) => result?.data);
};

const deleteFilePertanyaanCommitee = (payload) => {
  return ApiClient.delete('/finalisasi/admin/credit_commite/hapus_file', payload).then((result) => result?.data);
};

const deleteFilePertanyaanAkad = (payload) => {
  return ApiClient.delete('/finalisasi/admin/akad_credit/hapus_file', payload).then((result) => result?.data);
};

const deleteFilePertanyaanLenderFactsheet = (payload) => {
  return ApiClient.delete('/finalisasi/admin/lender_approval/hapus_file_factsheet', payload).then((result) => result?.data);
};

const deleteFilePertanyaanLenderFile = (payload) => {
  return ApiClient.delete('/finalisasi/admin/lender_approval/hapus_file_lender', payload).then((result) => result?.data);
};

export default {
  getDokumenBorrower,
  getPertanyaanLenderApproval,
  getPertanyaanAkadCredit,
  getFinalisasiBorrower,
  putJawabanLenderApproval,
  putJawabanAkadKredit,
  postUploadFileLenderApproval,
  postUploadFileAkadKreditBorrower,
  postUploadFactSheetLender,

  getDokumenAdmin,
  getFinalisasiAdmin,
  putApprovalDocumentComitee,
  putApproveDokumenLender,
  putApproveDokumenAkad,
  postUploadFileCommitee,
  putStatusAdmin,
  putSigningNotes,
  postPertanyaanLenderApproval,
  postPertanyaanAkadKredit,
  postUploadFileAkadKreditBorrowerOSS,

  deleteFilePertanyaanAkad,
  deleteFilePertanyaanCommitee,
  deleteFilePertanyaanLenderFactsheet,
  deleteFilePertanyaanLenderFile,
};
