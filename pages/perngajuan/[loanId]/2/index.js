import AppLayout from 'layouts/app-layout';

import {
  Divider,
} from 'antd';

function Pengajuan2() {
  return (
    <Divider />
  );
}

Pengajuan2.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={2}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan2;
