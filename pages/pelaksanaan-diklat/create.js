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
} from 'antd';
import AppLayout from 'layouts/app-layout';
import DiklatService from 'services/DiklatService';
import dayjs from 'dayjs';
import QueryString from 'qs';
import PnsService from 'services/PnsService';

function MasterDataDiklatCreate() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dataPelaksanaan, setDataPelaksanaan] = useState({});
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
    const res = await PnsService.getAllPengajuan({ params });
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
    router.push('/master-data/diklat');
  };

  const onSubmit = async (e) => {
    const pelaksanaanDiklat = await DiklatService.createDiklat(e);
    if (pelaksanaanDiklat.status !== 201) return message.error('terjadi masalah pada server');
    // setLoading(true);
    setDataPelaksanaan(pelaksanaanDiklat.data.data);
    setParams((prevParam) => ({
      ...prevParam,
      'where[diklat]': pelaksanaanDiklat.data.data.diklat,
    }));
    console.log(pelaksanaanDiklat.data.data);
    console.log(e);
  };

  const onSbmitCandidate = async (e) => {
    const updateCandidate = await PnsService.updateCandidatePengajuan({ datas: selectedCandidate, id: dataPelaksanaan.id });
    if (updateCandidate.status !== 200) return message.error('Terjadi kesalahan pada server');
    setSubmited(true);
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
                <Button type='primary' htmlType='submit' disabled={dataPelaksanaan?.id}>
                  {t('button:submit')}
                </Button>
                <Button type='default' onClick={onBack} disabled={dataPelaksanaan?.id}>
                  {t('button:cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      {dataPelaksanaan?.id ? (
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
          <Space size='middle'>
            <Button type='primary' htmlType='submit' onClick={onSbmitCandidate} disabled={submited}>
              {t('button:submit')}
            </Button>
            <Button type='default' onClick={onBack} disabled={submited}>
              {t('button:cancel')}
            </Button>
          </Space>
        </Card>
      ) : null}

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

export default MasterDataDiklatCreate;
