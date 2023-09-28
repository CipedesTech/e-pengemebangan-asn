import AppLayout from 'layouts/app-layout';

import {
  Divider,
  Empty,
} from 'antd';

function JenisPengembangan() {
  return (
    <>
      <Divider />
      <Empty />
    </>
  );
}

JenisPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='jenis' onTab='jenis'>
      {page}
    </AppLayout>
  );
};

export default JenisPengembangan;
