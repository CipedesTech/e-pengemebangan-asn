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
  Select,
} from 'antd';
import AppLayout from 'layouts/app-layout';

function MasterDataDiklatCreate() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onBack = () => {
    router.push('/master-data/diklat');
  };

  const onSubmit = (e) => {
    // setLoading(true);
    console.log(e);
  };

  return (
    <Card>
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' onFinish={onSubmit}>
          <Form.Item
            name='nama'
            label={t('Nama Diklat')}
            rules={[{ required: true }]}
          >
            <Input placeholder={t('placeholder:enter', { field: t('Nama Diklat') })} />
          </Form.Item>
          <Form.Item
            label='Kompetensi diklat'
            name='diklat'
            rules={[
              { required: true },
            ]}
          >
            <Select
              options={[
                {
                  value: 'jpt',
                  label: 'Manajerial',
                },
                {
                  value: 'pelaksana',
                  label: 'Pemerintah',
                },
                {
                  value: 'fungsional',
                  label: 'Fungsional',
                },
                {
                  value: 'pengawas',
                  label: 'Sosiokultural',
                },
                {
                  value: 'admin',
                  label: 'Teknis',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name='pagu'
            label='Pagu'
            rules={[{ required: true }]}
          >
            <Input type='number' placeholder={t('placeholder:enter')} />
          </Form.Item>
          <Form.Item
            name='kuota'
            label='Kuota Diklat'
            rules={[{ required: true }]}
          >
            <Input type='number' placeholder={t('placeholder:enter')} />
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

MasterDataDiklatCreate.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Buat Diklat Baru' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default MasterDataDiklatCreate;
