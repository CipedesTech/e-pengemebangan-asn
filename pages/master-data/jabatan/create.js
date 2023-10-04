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

function MasterDataJabatanCreate() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onBack = () => {
    router.push('/master-data/jabatan');
  };

  const onSubmit = () => {
    setLoading(true);
  };

  return (
    <Card>
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={onSubmit}>
          <Form.Item
            name='nama'
            label={t('Nama Jabatan')}
            rules={[{ required: true, message: t('validation:required', { field: t('Nama Jabatan') }) }]}
          >
            <Input placeholder={t('placeholder:enter', { field: t('Nama Jabatan') })} />
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

MasterDataJabatanCreate.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Buat Jabatan Baru' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default MasterDataJabatanCreate;
