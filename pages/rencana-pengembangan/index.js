/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AppLayout from 'layouts/app-layout';

import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  Input,
  Steps,
} from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, CheckOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import qs from 'qs';
import PnsService from 'services/PnsService';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function ListPengembanganDiri() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const query = qs.parse(window.location.search.split('?')[1]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    data: {},
  });
  const [modalKeterangan, setModalKeterangan] = useState();
  const [params, setParams] = useState({
    page: parseInt(query.page, 10) || 1,
    perPage: parseInt(query.perPage, 10) || 10,
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const fetchData = async () => {
    setLoading(true);
    const res = await PnsService.getAllPengajuan({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    fetchData({ params });
  }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData(params);
  }, [params]);
  console.log(detailModal.data);
  // useEffect(() => {
  //   console.log(query);
  // }, [query]);

  const onDetail = async (status, record) => {
    setLoading(true);
    setDetailModal({ isOpen: false, data: {} });
    const pengajuan = await PnsService.updatePengajuan(record.id, { status, keterangan: detailModal.keterangan });
    if (pengajuan.status !== 200) {
      setLoading(false);
      return message.error('terjadi kesalahan');
    }
    fetchData(params);
    return message.success(`${record.id} di ${status === 'verified' ? 'verifikasi' : 'ajukan'}`);
  };

  const onPageChange = (page, pageSize) => {
    router.push('', `?page=${page}&perPage=${pageSize}`, { scroll: false });
    setParams((prevParam) => ({
      ...prevParam,
      page,
      perPage: pageSize,
    }));
  };

  const onCreate = () => {
    router.push('/rencana-pengembangan/data-diri');
  };

  const openModal = (record) => {
    setModalKeterangan('');
    const history = record.keterangan.map((el) => ({ title: `${el.status} ${dayjs(el.createdAt).format('DD MMMM YYYY HH:mm')}`, description: el.keterangan }));
    setDetailModal({ isOpen: true, data: record, history });
  };

  const updateKeterangan = (evt) => {
    setModalKeterangan(evt.target.value);
    setDetailModal((prev) => ({
      ...prev,
      keterangan: evt.target.value,
    }));
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
        } else if (text === 'verified') {
          return <Tag color='green'>diverifikasi</Tag>;
        } else {
          return <Tag color='red'>ditolak</Tag>;
        }
      },
    },
    {
      title: 'tanggal pengajuan',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD MMMM YYYY HH:mm'),
    },
    {
      title: t('Action'),
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Space>
          {/* <Tooltip placement='top' title='verifikasi'>
            <Button
              type='default'
              size='small'
              className='ant-btn-geekblue'
              icon={<CheckOutlined />}
              disabled={record.status === 'verified' || record.status === 'rejected'}
              onClick={() => onDetail('verified', record)}
            />
          </Tooltip>
          <Tooltip placement='top' title='tolak'>
            <Button
              type='default'
              size='small'
              className='ant-btn-danger'
              icon={<CloseOutlined />}
              disabled={record.status === 'verified' || record.status === 'rejected'}
              onClick={() => onDetail('rejected', record)}
            />
          </Tooltip> */}
          <Tooltip placement='top' title='tolak'>
            <Button
              type='primary'
              size='small'
              className='ant-btn-geekblue'
              icon={<EyeOutlined />}
              onClick={() => openModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='cards-container'>
      <Row>
        <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>List Usulan Calon Diklat</span>
        </Col>
        <Col span={24}>
          <div className='d-flex m-4 align-items-center justify-content-end'>
            <Button
              disabled={loading}
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => onCreate()}
            >
              Tambah Calon Usulan Diklat
            </Button>

          </div>
        </Col>
        {/* <Col span={24} className='px-4 py-4'>
              <Form form={form} layout='vertical' autoComplete='off' onFinish={onSubmit}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Form.Item
                      name='transaksi_id'
                      label={t('Transaksi ID')}
                      // rules={[{ required: true, message: t('validation:required', { field: t('Nama Uji Kompetensi') }) }]}
                    >
                      <Input placeholder='Masukkan Transaksi ID' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='nama'
                      label={t('Borrower Name')}
                      // rules={[{ required: true, message: t('validation:required', { field: t('Nama Uji Kompetensi') }) }]}
                    >
                      <Input placeholder='Masukkan Nama Borrower' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Form.Item
                      name='nilai_pinjaman'
                      label={t('Nilai Pinjaman')}
                      // rules={[{ required: true, message: t('validation:required', { field: t('Nama Uji Kompetensi') }) }]}
                    >
                      <Input placeholder='Masukkan Nilai Pinjaman' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='status'
                      label={t('Status')}
                    >
                      <Select
                        optionFilterProp='children'
                        placeholder={t('placeholder:select', { field: t('Status') })}
                        allowClear
                        filterOption={(input, option) => (option.key.toLowerCase().includes(input.toLowerCase()))}
                      >
                        <Select.Option value={0}>Baru</Select.Option>
                        <Select.Option value={2}>Rejected</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Form.Item
                      name='tanggal'
                      label={t('Waktu')}
                      // rules={[{ required: true, message: t('validation:required', { field: t('Nama Uji Kompetensi') }) }]}
                    >
                      <DatePicker
                        placeholder='Pilih Waktu'
                        picker='date'
                        disabledDate={(current) => current > dayjs()}
                        className='w-100'
                        allowClear={false}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ margin: 'auto', alignItems: 'center' }}>
                    <Form.Item className='mb-0'>
                      <Space size='middle'>
                        <Button type='primary' htmlType='submit'>
                          {t('button:Terapkan')}
                        </Button>
                        <Button type='danger' onClick={onReset}>
                          {t('button:Reset')}
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col> */}
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Table
              loading={loading}
              columns={columns}
              dataSource={tableData.data}
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
          </Card>
        </Col>
      </Row>
      <Modal
        title='Detail Data Pengaju'
        open={detailModal.isOpen}
        onCancel={() => {
          setDetailModal({ isOpen: false, data: {} });
          setModalKeterangan('');
        }}
        onOk={() => {
          setDetailModal({ isOpen: false, data: {} });
        }}
        disabled={detailModal?.data?.status === 'verified' || detailModal?.data?.status === 'submit'}
        okText='Verifikasi'
        cancelText='Tolak'
        footer={[
          <Button
            key='Submit'
            type='default'
            size='small'
            className='ant-btn-geekblue'
            icon={<CheckOutlined />}
            disabled={detailModal?.data?.status === 'verified' || detailModal?.data?.status === 'submit'}
            onClick={() => onDetail('submit', detailModal?.data)}
          >Ajukan Kembali
          </Button>,
          // <Button
          //   key='Back'
          //   type='default'
          //   size='small'
          //   className='ant-btn-danger'
          //   icon={<CloseOutlined />}
          //   disabled={detailModal?.data?.status === 'verified' || detailModal?.data?.status === 'submit'}
          //   onClick={() => onDetail('rejected', detailModal?.data)}
          // >Tolak
          // </Button>,
        ]}
      >
        <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
          <Col span={24}>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={12}>
                <Text>NIP</Text>
              </Col>
              <Col span={12}>
                <Text strong>{detailModal?.data?.pegawai_id?.nip}</Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={12}>
                <Text>Nama Lengkap</Text>
              </Col>
              <Col span={12}>
                <Text strong>{detailModal?.data?.pegawai_id?.nama_pegawai}</Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={12}>
                <Text>Status</Text>
              </Col>
              <Col span={12}>
                <Text strong>{detailModal?.data?.status === 'submit' ? <Tag color='geekblue'>diajukan</Tag>
                  : detailModal?.data?.status === 'verified' ? <Tag color='green'>diverifikasi</Tag>
                    : <Tag color='red'>ditolak</Tag>}
                </Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={12}>
                <Text>Diklat</Text>
              </Col>
              <Col span={12}>
                <Text strong>{detailModal?.data?.diklat}
                </Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={12}>
                <Text>Keterangan</Text>
              </Col>
              <Col span={12}>
                <TextArea disabled={detailModal?.data?.status === 'verified' || detailModal?.data?.status === 'submit'} value={modalKeterangan} onChange={(e) => updateKeterangan(e)} rows={4} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
          <Col span={24}>
            <Steps
              progressDot
              direction='vertical'
              size='small'
              current={detailModal?.data?.keterangan?.length}
              items={detailModal?.history}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

ListPengembanganDiri.getLayout = function getLayout(page) {
  return (
    <AppLayout title='PNS-pengajuan' onTab='verifikasi_pengajuan' extra={false}>
      {page}
    </AppLayout>
  );
};

export default ListPengembanganDiri;
