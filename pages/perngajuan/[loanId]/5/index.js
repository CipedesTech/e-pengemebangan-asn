import AppLayout from 'layouts/app-layout';

import {
  Divider,
} from 'antd';

function Pengajuan5() {
  return (
    <Divider />
  );
}

Pengajuan5.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={5}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan5;
