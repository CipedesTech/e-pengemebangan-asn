import ApiClient from 'utils/ApiClient';

const getKategoriSubmission = () => {
  return ApiClient.get('/submisi/kategori_persyaratan').then((result) => result?.data);
};

const getDetailSubmissionUser = (id) => {
  return ApiClient.get(`/submisi/get_submisi/${id}`).then((result) => result?.data);
};

const getCatatanSubmisi = (params) => {
  return ApiClient.get(`/submisi/${params}/catatan_submisi`).then((result) => result?.data);
};

const getExecutiveFile = (id) => {
  return ApiClient.get(`/submisi/executive_summaries/${id}`).then((result) => result?.data);
};

const putNotesBorrower = (payload) => {
  return ApiClient.put(`/submisi/${payload.id}/put_catatan_submisi`, payload.data).then((result) => result?.data);
};

const putLinkGDrive = (payload) => {
  return ApiClient.put(`/pinjaman/${payload.id}/put_link_submisi`, payload.data).then((result) => result?.data);
};

const postKategoriSubmission = (payload) => {
  return ApiClient.post('/submisi/submisi_persyaratan', payload).then((result) => result?.data);
};

const putKategoriSubmissionAdmin = (payload) => {
  return ApiClient.post('/submisi/sales/update_persyaratan', payload).then((result) => result?.data);
};

const putExecutiveSummarySubmissionAdmin = (payload) => {
  return ApiClient.put(`/submisi/${payload.id}/put_executive_summary`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const postVerifikasiAdmin = (payload) => {
  return ApiClient.post('/submisi/sales/verifikasi', payload).then((result) => result?.data);
};

const putNotesRejectionAdmin = (payload) => {
  return ApiClient.put(`/pinjaman/reject/${payload.id}`, payload.data).then((result) => result?.data);
};

const getProgress = (id) => {
  return ApiClient.get(`/submisi/progress/${id}`).then((result) => result?.data);
};

const deleteFilePertanyaan = (payload) => {
  return ApiClient.delete('/submisi/admin/delete_executive_summary', payload).then((result) => result?.data);
};

export default {
  getKategoriSubmission,
  getDetailSubmissionUser,
  getCatatanSubmisi,
  putNotesBorrower,
  putLinkGDrive,
  postKategoriSubmission,
  putKategoriSubmissionAdmin,
  putExecutiveSummarySubmissionAdmin,
  postVerifikasiAdmin,
  putNotesRejectionAdmin,

  getProgress,
  getExecutiveFile,
  deleteFilePertanyaan,
};
