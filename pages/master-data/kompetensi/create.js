import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  Card,
  Button,
  Form,
  Spin,
  Input,
  Space,
} from 'antd';
import AppLayout from 'layouts/app-layout';

function MasterDataKompetensiCreate() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onBack = () => {
    router.push('/master-data/kompetensi');
  };

  const onSubmit = () => {
    setLoading(true);
  };

  return (
    <Card>
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={onSubmit}>
          <Form.Item
            name='nama_pelajaran'
            label={t('Judul Kompetensi')}
            rules={[{ required: true, message: t('validation:required', { field: t('Judul Kompetensi') }) }]}
          >
            <Input placeholder={t('placeholder:enter', { field: t('Judul Kompetensi') })} />
          </Form.Item>
          <Form.Item className='mb-0'>
            <Space size='middle'>
              <Button type='primary' htmlType='submit'>
                {t('button:submit')}
              </Button>
              <Button type='default' onClick={onBack}>
                {t('button:cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

MasterDataKompetensiCreate.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Buat Kompetensi Baru' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default MasterDataKompetensiCreate;
