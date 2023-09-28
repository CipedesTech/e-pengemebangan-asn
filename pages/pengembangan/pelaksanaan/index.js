/* eslint-disable no-nested-ternary */
import AppLayout from 'layouts/app-layout';

import {
  Divider, Empty,
} from 'antd';

function PelaksanaanPengembangan() {
  return (
    <>
      <Divider />
      <Empty />
    </>
  );
}

PelaksanaanPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pelaksanaan' onTab='pelaksanaan'>
      {page}
    </AppLayout>
  );
};

export default PelaksanaanPengembangan;
