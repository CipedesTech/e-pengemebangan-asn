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
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import MasterDiklatService from 'services/MasterDiklatService';

export async function getServerSideProps({ query }) {
  const { id } = query;
  let data = {};
  let diklats = [];
  try {
    const res = await DiklatService.getPelaksanaanDiklatById(id);
    if (res.status === 200) data = res.data.data;
    const diklat = await MasterDiklatService.getAll({ params: { perPage: 2000 } });
    if (diklat.status === 200) diklats = diklat.data.data.data.map((el) => ({ value: el.id, label: el.nama }));
  } catch (err) {
    // console.log(err.status);
  }
  return { props: { data, diklats } };
}

function MasterDataDiklatCreate({ data, diklats }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const formRef = createRef();
  const [loading, setLoading] = useState(false);
  const [Edit, setEdit] = useState(true);
  const query = QueryString.parse(window.location.search.split('?')[1]);
  const [dataPelaksanaan, setDataPelaksanaan] = useState({ submited: false, data: {} });
  const [params, setParams] = useState({
    page: parseInt(query.page, 10) || 1,
    perPage: parseInt(query.perPage, 10) || 10,
    'where[diklat]': data.diklat,
    'where[status]': 'verified',
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const [selectedCandidate, setSelectedCandidate] = useState([]);
  const [submited, setSubmited] = useState(false);

  const fetchData = async () => {
    const res = await PnsService.getAllPengajuanVerif({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    }));
  };

  useEffect(() => {
    formRef.current.setFieldsValue(data);
    // form.setFieldValue('diklat', data.Diklat.nama);
  }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData(params);
  }, [params]);

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
      render: (text, record, index) => {
        return record.kompetensi.nama;
      },
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

  const onSubmit = async (e) => {
    console.log('SUBMIT', e);
    setDataPelaksanaan({ submited: true, data: e });
    setLoading(true);
    setParams((prevParam) => ({
      ...prevParam,
      'where[status]': 'verified',
    }));
    setLoading(false);
  };

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
    getCheckboxProps: (record) => {
      console.log(selectedCandidate);
      console.log(dataPelaksanaan);
      console.log(record);
      return {
        disabled: selectedCandidate.length === parseInt(dataPelaksanaan?.data?.kuota, 10) && selectedCandidate.filter((el) => el.id === record.id) < 1,
        // Column configuration not to be checked
        name: record.name,
      };
    },
    // selectedRowKeys: data.t_pns_diajukan.map((el) => el.id),
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
          <Button
            type={!Edit ? 'danger' : 'primary'}
            icon={<EditOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => setEdit(!Edit)}
          >
            {!Edit ? 'Batal' : 'Edit'}
          </Button>

        </div>
      </Col>
      <Col span={24}>
        <Card>
          <Spin spinning={loading}>
            <Form ref={formRef} form={form} layout='vertical' onFinish={onSubmit}>
              <Form.Item
                name='nama'
                label={t('Nama Diklat')}
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={Edit} placeholder={t('placeholder:enter', { field: t('Nama Diklat') })} />
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
                  disabled={Edit}
                />
              </Form.Item>
              <Form.Item
                name='pagu'
                label='Pagu'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={Edit} type='number' placeholder='1000000' />
              </Form.Item>
              <Form.Item
                name='kuota'
                label='Kuota Diklat'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={Edit} type='number' placeholder='10' />
              </Form.Item>
              <Form.Item className='mb-0'>
                <Space size='middle'>
                  <Button type='primary' htmlType='submit' disabled={Edit}>
                    Update Table
                  </Button>
                  <Button type='default' onClick={onBack} disabled={Edit}>
                    {t('button:cancel')}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
        {data?.id ? (
          <Card title='List Kandidat'>
            {!Edit
              ? (
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
              )
              : (
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={data.t_pns_diajukan}
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
              )}
            <Space size='middle'>
              <Button type='primary' htmlType='submit' onClick={onSbmitCandidate} disabled={Edit}>
                {t('button:submit')}
              </Button>
              <Button type='default' onClick={onBack} disabled={submited}>
                {t('button:cancel')}
              </Button>
            </Space>
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
  diklats: PropTypes.object.isRequired,
};

export default MasterDataDiklatCreate;
