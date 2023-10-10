/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { createRef, useEffect, useState } from 'react';
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
  message,
  Table,
  Tag,
  Row,
  Col,
} from 'antd';
import AppLayout from 'layouts/app-layout';
import DiklatService from 'services/DiklatService';
import dayjs from 'dayjs';
import QueryString from 'qs';
import PropTypes from 'prop-types';
import PnsService from 'services/PnsService';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { ArrowLeftOutlined } from '@ant-design/icons';

export async function getServerSideProps({ query }) {
  const { id } = query;
  let data = {};
  try {
    const res = await DiklatService.getPelaksanaanDiklatById(id);
    if (res.status === 200) data = res.data.data;
    console.log(res.data);
  } catch (err) {
    // console.log(err.status);
  }
  return { props: { data } };
}

function MasterDataDiklatCreate({ data }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const formRef = createRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    formRef.current.setFieldsValue(data);
  }, []);

  const onBack = () => {
    router.push('/master-data/diklat');
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => {
        return 1 + index;
      },
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      render: (text, record, index) => {
        return record.pegawai_id.nip;
      },
    },
    {
      title: 'Nama',
      dataIndex: 'nama_pegawai',
      render: (text, record, index) => {
        return record.pegawai_id.nama_pegawai;
      },
    },
    {
      title: 'Kompetensi',
      dataIndex: 'diklat',
      key: 'diklat',
    },

    {
      title: 'Status Pengajuan',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 'submit') {
          return <Tag color='geekblue'>diajukan</Tag>;
        } if (text === 'verified') {
          return <Tag color='green'>diverifikasi</Tag>;
        }
        return <Tag color='red'>ditolak</Tag>;
      },
    },
    {
      title: 'tanggal pengajuan',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD MMMM YYYY HH:mm'),
    },
  ];

  return (
    <Row gutter={ROW_GUTTER}>
      <Col span={24}>
        <div className='d-flex align-items-center justify-content-end'>
          <Button
            type='primary'
            icon={<ArrowLeftOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => router.back()}
          >
            Kembali
          </Button>

        </div>
      </Col>
      <Col span={24}>
        <Card>
          <Spin spinning={loading}>
            <Form ref={formRef} form={form} layout='vertical'>
              <Form.Item
                name='nama'
                label={t('Nama Diklat')}
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled placeholder={t('placeholder:enter', { field: t('Nama Diklat') })} />
              </Form.Item>
              <Form.Item
                label='Kompetensi diklat'
                name='diklat'
                rules={[
                  { required: true },
                ]}
              >
                <Input style={{ color: 'black' }} disabled />
              </Form.Item>
              <Form.Item
                name='pagu'
                label='Pagu'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled type='number' placeholder='1000000' />
              </Form.Item>
              <Form.Item
                name='kuota'
                label='Kuota Diklat'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled type='number' placeholder='10' />
              </Form.Item>
              {/* <Form.Item className='mb-0'>
              <Space size='middle'>
                <Button type='primary' htmlType='submit' disabled={dataPelaksanaan?.id}>
                  {t('button:submit')}
                </Button>
                <Button type='default' onClick={onBack} disabled={dataPelaksanaan?.id}>
                  {t('button:cancel')}
                </Button>
              </Space>
            </Form.Item> */}
            </Form>
          </Spin>
        </Card>
        {data?.id ? (
          <Card title='List Kandidat'>
            <Table
              loading={loading}
              columns={columns}
              dataSource={data.m_pns_diajukan}
              scroll={{ x: 700 }}
            />
            {/* <Space size='middle'>
            <Button type='primary' htmlType='submit' onClick={onSbmitCandidate} disabled={submited}>
              {t('button:submit')}
            </Button>
            <Button type='default' onClick={onBack} disabled={submited}>
              {t('button:cancel')}
            </Button>
          </Space> */}
          </Card>
        ) : null}
      </Col>
    </Row>
  );
}

MasterDataDiklatCreate.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Buat Diklat Baru' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

MasterDataDiklatCreate.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MasterDataDiklatCreate;
