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
  DatePicker,
} from 'antd';
import AppLayout from 'layouts/app-layout';
import DiklatService from 'services/DiklatService';
import dayjs from 'dayjs';
import QueryString from 'qs';
import PropTypes from 'prop-types';
import PnsService from 'services/PnsService';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import Cookies from 'utils/Cookies';
import axios from 'axios';

export async function getServerSideProps({ query, ...ctx }) {
  const { id } = query;
  let data = {};
  let diklats = [];
  try {
    const { API_URL } = process.env;
    const token = Cookies.getData('token', ctx);
    const res = await axios.get(`${API_URL}/api/diklat/pelaksanaan/${id}`, { params: { perPage: 1000 },
      headers: {
        Authorization: `Bearer ${token}`,
      } });
    if (res.status === 200) data = res.data.data;
    const diklat = await axios.get(`${API_URL}/api/master/diklat`, { params: { perPage: 1000 },
      headers: {
        Authorization: `Bearer ${token}`,
      } });
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
    const day = dayjs(`${data.tahun}-${data.bulan}`, 'YYYY-MM');
    const dayRealisasi = dayjs(`${data.realisasiTahun}-${data.realisasiBulan}`, 'YYYY-MM');
    formRef.current.setFieldsValue({ ...data, jadwalPelaksana: day, RealisasiJadwalPelaksana: dayRealisasi });
  }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData(params);
  }, [params]);

  const onBack = () => {
    router.push('/monev');
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
      title: 'Kehadiran',
      render: (text, record, index) => {
        if (record.hadir) {
          return <Tag color='geekblue'>Hadir</Tag>;
        }
        return <Tag color='red'>-</Tag>;
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
    const { jadwalPelaksanaan, ...rest } = e;
    const body = {
      ...rest,
      bulan: dayjs(jadwalPelaksanaan).month(),
      tahun: dayjs(jadwalPelaksanaan).year(),
    };
    setDataPelaksanaan({ submited: true, data: body });
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
      return {
        disabled: record.hadir === true,
        name: record.name,
      };
    },
  };

  const onSbmitCandidate = async (e) => {
    await form.validateFields(['RealisasiJadwalPelaksana', 'realisasiKuota', 'realisasiPagu']);
    const { RealisasiJadwalPelaksana, jadwalPelaksana, ...rest } = form.getFieldsValue();
    const body = {
      ...rest,
      bulan: dayjs(jadwalPelaksana).month(),
      tahun: dayjs(jadwalPelaksana).year(),
      realisasiBulan: dayjs(RealisasiJadwalPelaksana).month(),
      realisasiTahun: dayjs(RealisasiJadwalPelaksana).year(),
    };
    delete body.RealisasiJadwalPelaksana;
    delete body.jadwalPelaksana;
    setLoading(true);
    const pelaksanaanDiklat = await DiklatService.updatePelaksanaanDiklat(router.query.id, body);
    if (pelaksanaanDiklat.status !== 200) return message.error('terjadi masalah pada server2');
    if (selectedCandidate.length > 0) {
      const updateCandidate = await PnsService.updateCandidatePengajuanKehadiran({ datas: selectedCandidate, id: pelaksanaanDiklat.data.data.id });
      if (updateCandidate.status !== 200) return message.error('Terjadi kesalahan pada server1');
    }
    setLoading(false);
    return router.push('/monev');
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
        </div>
      </Col>
      <Col span={24}>
        <Card>
          <Spin spinning={loading}>
            <Form ref={formRef} form={form} layout='vertical' onFinish={onSubmit}>
              <Form.Item
                name='nama'
                label={t('Nama Diklat')}
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
                name='realisasiPagu'
                label='Realisasi Pagu'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={loading} type='number' placeholder='1000000' />
              </Form.Item>
              <Form.Item
                name='kuota'
                label='Kuota Diklat'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={Edit} type='number' placeholder='10' />
              </Form.Item>
              <Form.Item
                name='realisasiKuota'
                label='Realisasi Kuota Diklat'
                rules={[{ required: true }]}
              >
                <Input style={{ color: 'black' }} disabled={loading} type='number' placeholder='10' />
              </Form.Item>
              <Form.Item
                name='jadwalPelaksana'
                label='Jadwal Pelaksanaan'
                rules={[{ required: true }]}
              >
                <DatePicker disabled={Edit} picker='month' />
              </Form.Item>
              <Form.Item
                name='RealisasiJadwalPelaksana'
                label='Realisasi Jadwal Pelaksanaan'
                rules={[{ required: true }]}
              >
                <DatePicker disabled={loading} picker='month' />
              </Form.Item>
            </Form>
          </Spin>
        </Card>
        {data?.id ? (
          <Card title='CheckList kehadiran Kandidat'>
            <Table
              loading={loading}
              columns={columns}
              dataSource={data.t_pns_diajukan}
              rowSelection={rowSelection}
              rowKey={(record) => record.id}
              scroll={{ x: 700 }}
              pagination={false}
            />
            <Space size='middle' style={{ marginTop: '25px' }}>
              <Button type='primary' htmlType='submit' onClick={onSbmitCandidate} disabled={loading}>
                {`${t('button:submit')} Realisasi`}
              </Button>
              <Button type='default' onClick={onBack} disabled={loading}>
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
