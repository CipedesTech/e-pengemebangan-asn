import ApiClient from 'utils/ApiClient';

// Borrower
const getResultScoring = (payload) => {
  return ApiClient.get('/pinjaman/scoring', payload).then((result) => result?.data);
};

// Admin
const putApproveScoringAnalyst = (payload) => {
  return ApiClient.put('/pinjaman/approve_scoring', payload.data).then((result) => result?.data);
};

// All Role
const getApprovedScoring = (payload) => {
  return ApiClient.get(`/pinjaman/scoring_detail/${payload}`).then((result) => result?.data);
};

export default {
  getResultScoring,
  putApproveScoringAnalyst,
  getApprovedScoring,
};
