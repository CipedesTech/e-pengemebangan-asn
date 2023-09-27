/* eslint-disable no-nested-ternary */
import AppLayout from 'layouts/app-layout';

import {
  Divider,
} from 'antd';

function Pengajuan4() {
  return (
    <Divider />
  );
}

Pengajuan4.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={4}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan4;
