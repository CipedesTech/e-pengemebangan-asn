import AppLayout from 'layouts/app-layout';

import {
  Divider, Empty,
} from 'antd';

function TingkatPengembangan() {
  return (
    <>
      <Divider />
      <Empty />
    </>
  );
}

TingkatPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Tingkat' onTab='tingkat'>
      {page}
    </AppLayout>
  );
};

export default TingkatPengembangan;
