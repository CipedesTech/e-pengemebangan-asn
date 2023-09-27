import ApiClient from 'utils/ApiClient';

const getBorrowerLoanTracker = (params) => {
  return ApiClient.get(`/pinjaman/track_pinjaman/${params.id}`).then((result) => result?.data);
};

export default {
  getBorrowerLoanTracker,
};
