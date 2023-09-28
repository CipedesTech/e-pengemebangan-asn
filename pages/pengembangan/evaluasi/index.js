import AppLayout from 'layouts/app-layout';

import {
  Divider, Empty,
} from 'antd';

function EvaluasiPengembangan() {
  return (
    <>
      <Divider />
      <Empty />
    </>
  );
}

EvaluasiPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Evaluasi' onTab='evaluasi'>
      {page}
    </AppLayout>
  );
};

export default EvaluasiPengembangan;
