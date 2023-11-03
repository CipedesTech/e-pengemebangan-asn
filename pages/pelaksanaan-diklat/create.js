/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { useEffect, useState } from 'react';
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
  Empty,
} from 'antd';
import AppLayout from 'layouts/app-layout';
import DiklatService from 'services/DiklatService';
import dayjs from 'dayjs';
import QueryString from 'qs';
import PnsService from 'services/PnsService';
import MasterDiklatService from 'services/MasterDiklatService';
import PropTypes from 'prop-types';

export async function getServerSideProps() {
  let diklats = [];
  try {
    const diklat = await MasterDiklatService.getAll({ params: { perPage: 2000 } });
    if (diklat.status === 200) diklats = diklat.data.data.data.map((el) => ({ value: el.id, label: el.nama }));
  } catch (err) {
    console.log(err);
  }
  return { props: { diklats } };
}

function MasterDataDiklatCreate({ diklats }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dataPelaksanaan, setDataPelaksanaan] = useState({ submited: false, data: {} });
  const [loading, setLoading] = useState(false);
  const query = QueryString.parse(window.location.search.split('?')[1]);

  const [params, setParams] = useState({
    page: parseInt(query.page, 10) || 1,
    perPage: parseInt(query.perPage, 10) || 10,
    'where[diklat]': '',
    'where[status]': 'verified',
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const fetchData = async () => {
    const res = await PnsService.getAllPengajuanVerif({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    }));
  };
  const [selectedCandidate, setSelectedCandidate] = useState([]);
  const [submited, setSubmited] = useState(false);
  // useEffect(() => {
  //   fetchData({ params });
  // }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData(params);
  }, [params]);

  // useEffect(() => {
  //   console.log(query);
  // }, [query]);

  const onPageChange = (page, pageSize) => {
    router.push('', `?page=${page}&perPage=${pageSize}`, { scroll: false });
    setParams((prevParam) => ({
      ...prevParam,
      page,
      perPage: pageSize,
    }));
  };

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCandidate(selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: selectedCandidate.length === dataPelaksanaan.kuota && selectedCandidate.filter((el) => el.id === record.id) < 1,
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onBack = () => {
    router.push('/pelaksanaan-diklat');
  };

  const onSubmit = async (e) => {
    setDataPelaksanaan({ submited: true, data: e });
    setLoading(true);
    setParams((prevParam) => ({
      ...prevParam,
      'where[diklat]': e.diklat,
      'where[status]': 'verified',
    }));
    setLoading(false);
  };

  const onSbmitCandidate = async (e) => {
    setLoading(true);
    const pelaksanaanDiklat = await DiklatService.createDiklat(dataPelaksanaan.data);
    if (pelaksanaanDiklat.status !== 201) return message.error('terjadi masalah pada server');
    const updateCandidate = await PnsService.updateCandidatePengajuan({ datas: selectedCandidate, id: pelaksanaanDiklat.data.data.id });
    if (updateCandidate.status !== 200) return message.error('Terjadi kesalahan pada server');
    setSubmited(true);
    setLoading(false);
    return router.push('/pelaksanaan-diklat');
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => {
        return (params.page - 1) * params.perPage + 1 + index;
        // return params.page > 1 ? index + (params.perPage * params.page) + 1 : index + 1;
      },
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      render: (text, record, index) => {
        return record.pegawai_id.nip_baru;
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
    <>
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
                options={diklats}
              />
            </Form.Item>
            <Form.Item
              name='pagu'
              label='Pagu'
              rules={[{ required: true }]}
            >
              <Input type='number' placeholder='1000000' />
            </Form.Item>
            <Form.Item
              name='kuota'
              label='Kuota Diklat'
              rules={[{ required: true }]}
            >
              <Input type='number' placeholder='10' />
            </Form.Item>
            <Form.Item className='mb-0'>
              <Space size='middle'>
                <Button type='primary' htmlType='submit' disabled={dataPelaksanaan?.submited}>
                  Pilih Kandidat
                </Button>
                <Button type='default' onClick={onBack} disabled={dataPelaksanaan?.submited}>
                  {t('button:cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      {/* {tableData.data.length > 0 ? ( */}
      <Card title='List Kandidat'>
        <Table
          loading={loading}
          columns={columns}
          dataSource={tableData.data}
          rowSelection={rowSelection}
          rowKey={(record) => record.id}
          scroll={{ x: 700 }}
          pagination={{
            total: tableData.total,
            showTotal: (total, range) => t('placeholder:pagination', { start: range[0], end: range[1], total }),
            current: params.page,
            pageSize: params.perPage,
            onChange: onPageChange,
          }}
        />
        <Space size='middle' className='mt-4'>
          <Button type='primary' htmlType='submit' onClick={onSbmitCandidate} disabled={submited || selectedCandidate.length === 0}>
            {t('button:submit')}
          </Button>
          <Button type='default' onClick={onBack} disabled={submited}>
            {t('button:cancel')}
          </Button>
        </Space>
      </Card>
      {/* )
        : (
          <Card title='List Kandidat'>
            <Empty />
          </Card>
        )} */}

    </>
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
  diklats: PropTypes.array.isRequired,
};

export default MasterDataDiklatCreate;
