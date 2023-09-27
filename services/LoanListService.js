import ApiClientUtility from 'utils/ApiClientIkiUtility';

const getUserLoanList = (params) => {
  return ApiClientUtility.get('/api-iki/gateway/v1/utility/application/', params).then((result) => result?.data);
};

const getDetailUserLoanList = (params) => {
  return ApiClientUtility.get(`/api-iki/gateway/v1/utility/application/${params.userId}/${params.loanId}`).then((result) => result?.data);
};

const getDetailUserLoanListNonGateway = (params) => {
  return ApiClientUtility.get(`/pinjaman/detail/${params.loanId}`).then((result) => result?.data);
};

const postRejectLoan = (payload) => {
  return ApiClientUtility.post(`/pinjaman/add_pinjaman/gateway/v1/utility/marketplace/${payload.typeReq}/${payload.loanId}`, payload.data).then((result) => result?.data);
};

export default {
  getUserLoanList,
  getDetailUserLoanList,
  getDetailUserLoanListNonGateway,
  postRejectLoan,
};
