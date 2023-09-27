import ApiClient from 'utils/ApiClient';

// Borrower
const getOwnVisitScheduleBorrower = (id) => {
  return ApiClient.get(`/visit_schedule/survey_information/${id}`).then((result) => result?.data);
};

// Admin
const postScheduleVisitAdmin = (payload) => {
  return ApiClient.post('/visit_schedule/create_visit_schedule', payload.data).then((result) => result?.data);
};

const getDetailVisitAdmin = (id) => {
  return ApiClient.get(`/visit_schedule/detail_visit_schedule/${id}`).then((result) => result?.data);
};

const putVisitAdmin = (payload) => {
  return ApiClient.put(`/visit_schedule/edit_visit_schedule/${payload.id}`, payload.data).then((result) => result?.data);
};

const postUploadVisitResult = (payload) => {
  return ApiClient.post(`/visit_schedule/upload_visit_result/${payload.id}`, payload.data, { headers: {
    'Content-Type': 'multipart/form-data',
  } }).then((result) => result?.data);
};

const deleteFilePertanyaan = (payload) => {
  return ApiClient.delete('/visit_schedule/admin/hapus_file', payload).then((result) => result?.data);
};

export default {
  getOwnVisitScheduleBorrower,
  getDetailVisitAdmin,
  postScheduleVisitAdmin,
  putVisitAdmin,
  postUploadVisitResult,
  deleteFilePertanyaan,
};
