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
  message,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PinjamanService from 'services/PinjamanService';
import { formatRupiah } from 'utils/Utils';

const { Title, Paragraph, Text } = Typography;

function ListASN() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [loanList, setLoanList] = useState({
    data: [],
    total: 0,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const [paramsCari, setParamsCari] = useState({
    page: 1,
    limit: 10,
  });

  const fetchBorrowerLoanList = () => {
    setLoading(true);
    PinjamanService.getBorrowerPinjaman(params)
      .then((res) => {
        setLoanList({
          data: res?.data || [],
        });
      }).catch(() => {
        message.error('Belum Ada Data Borrower');
      }).finally(() => setLoading(false));
  };

  const fetchNonBorrowerLoanList = () => {
    setLoading(true);
    PinjamanService.getAllPinjaman({ params })
      .then((res) => {
        setLoanList({
          data: res?.data,
          total: res?.total || 0,
        });
      }).catch(() => {
        message.error('Belum ada Data Non Borrower');
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.type === 'borrower') {
      fetchBorrowerLoanList();
    } else {
      fetchNonBorrowerLoanList();
    }
  }, [params]);

  const onDetail = (record) => {
    window.localStorage.removeItem('pinjaman_id');
    window.localStorage.removeItem('pinjaman');

    const loanId = record?.pinjaman_id;
    const userId = record?.borrower_id;

    router.push(`/pengajuan/${loanId}/1`);

    window.localStorage.setItem('pinjaman_id', userId);
    window.localStorage.setItem('pinjaman', JSON.stringify(record));
  };

  const fetchCari = () => {
    PinjamanService.getCariPinjaman({
      params: paramsCari,
    })
      .then((res) => {
        setLoanList({
          data: res.data,
          total: res.total,
        });
      }).catch(() => {
        message.error('Belum ada Data');
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCari();
  }, [paramsCari]);

  const onSubmit = (values) => {
    setLoading(true);
    setStatus(1);

    setParamsCari({
      ...paramsCari,
      waktu: values.tanggal !== undefined ? dayjs(values.tanggal).format('YYYY-MM-DD').toString().split('T')[0] : null,
      transaksi_id: values.transaksi_id !== undefined ? values.transaksi_id : null,
      amount: values.nilai_pinjaman !== undefined ? values.nilai_pinjaman : null,
      nama: values.nama !== undefined ? values.nama : null,
      status: values.status !== undefined ? values.status : null,
    });
  };

  const onReset = () => {
    fetchNonBorrowerLoanList();
    setStatus(0);
    setParams({
      page: 1,
      limit: 10,
    });
    form.resetFields();
  };

  const onPageChange = (page, pageSize) => {
    if (status === 0) {
      setParams((prevParam) => ({
        ...prevParam,
        page,
        limit: pageSize,
      }));
    } else {
      setParamsCari((prevParam) => ({
        ...prevParam,
        page,
        limit: pageSize,
      }));
    }
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: 'NIP',
      dataIndex: 'nip',
      key: 'nip',
    },
    {
      title: 'Nama',
      dataIndex: 'borrower_name',
      key: 'borrower_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return text === 0 ? <Tag color='geekblue'>Baru</Tag> : <Tag color='orange'>Rejected</Tag>;
      },
    },
    {
      title: t('Action'),
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Space>
          <Tooltip placement='top' title={t('button:detail')}>
            <Button
              type='primary'
              size='small'
              className='ant-btn-geekblue'
              icon={<EyeOutlined />}
              onClick={() => onDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className='cards-container' style={{ backgroundColor: 'whitesmoke' }}>
      {user?.type !== 'borrower' ? (
        <>
          <Row>
            <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>List ASN</span>
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
                  dataSource={loanList.data}
                  rowKey={(record) => record.id}
                  scroll={{ x: 700 }}
                  pagination={{
                    total: loanList.total,
                    showTotal: (total, range) => t('placeholder:pagination', { start: range[0], end: range[1], total }),
                    current: status === 0 ? params.page : paramsCari.page,
                    pageSize: status === 0 ? params.limit : paramsCari.limit,
                    onChange: onPageChange,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>Daftar Pinjaman</span>
          </Col>
          <Col span={24}>
            {loanList.data.map((item, key) => (
              <Card className='mx-4 my-4' loading={loading} key={key}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Row>
                      <Col span={6}>
                        <Title level={4}>{item.package !== undefined ? `${item.package}` : '-'}</Title>
                        <Paragraph><Text strong>Transaksi ID:</Text> {item.transaksi_id || '-'}</Paragraph>
                        <Paragraph><Text strong>Status:</Text> {item.status === 0 ? 'Baru' : item.status === 2 ? 'Ditolak' : '-'}</Paragraph>
                      </Col>
                      <Col span={5}>
                        <Title level={4} />
                        <Text strong>Nilai Pengajuan</Text>
                        <Paragraph>{item.amount !== undefined ? formatRupiah(item.amount, 'Rp. ') : '-'}</Paragraph>
                      </Col>
                      <Col span={5}>
                        <Title level={4} />
                        <Text strong>Tenor</Text>
                        <Paragraph>{item.tenor !== undefined ? `${item.tenor} Bulan` : '-'}</Paragraph>
                      </Col>
                      <Col span={5}>
                        <Title level={4} />
                        <Text strong>Bunga</Text>
                        <Paragraph>{item.rate !== undefined ? `${parseFloat(item.rate, 3).toFixed(2)} per Tahun` : '-'}</Paragraph>
                      </Col>
                      <Col span={3}>
                        <Button type='primary' block onClick={() => onDetail(item)}>Detail</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </div>
  );
}

ListASN.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default ListASN;
