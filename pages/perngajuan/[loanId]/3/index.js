import { Divider } from 'antd';
import AppLayout from 'layouts/app-layout';

function Pengajuan3() {
  return (
    <Divider />
  );
}

Pengajuan3.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={3}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan3;
