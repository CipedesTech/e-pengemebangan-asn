import { Divider, Empty } from 'antd';
import AppLayout from 'layouts/app-layout';

function TahapanPengembangan() {
  return (
    <>
      <Divider />
      <Empty />
    </>
  );
}

TahapanPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Tahapan' onTab='tahapan'>
      {page}
    </AppLayout>
  );
};

export default TahapanPengembangan;
