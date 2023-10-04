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
import { formatRupiah } from 'utils/Utils';
import PnsService from 'services/PnsService';

const { Title, Paragraph, Text } = Typography;

function ListASN() {
  const router = useRouter();
  const { t } = useTranslation();
  // const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });

  const fetchData = async (param) => {
    const res = await PnsService.getAllPns({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    }));
  };

  useEffect(() => {
    fetchData({ params });
  }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData(params);
  }, [params]);

  const onDetail = (record) => {
    router.push(`list-pns/${record.nip}/1`);
  };

  const onPageChange = (page, pageSize) => {
    console.log(page, pageSize);
    setParams((prevParam) => ({
      ...prevParam,
      page,
      perPage: pageSize,
    }));
  };

  const dataDummy = [
    {
      nip: 1111,
      nama_pegawai: 'roorf',
      status_kepegawaian: 'pns',
    },
  ];

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
      dataIndex: 'nama_pegawai',
      key: 'nama_pegawai',
    },
    {
      title: 'Status Kepegawaian',
      dataIndex: 'status_kepegawaian',
      key: 'status_kepegawaian',
      render: (text) => {
        return text === 'pns' ? <Tag color='geekblue'>{text}</Tag> : <Tag color='orange'>{text}</Tag>;
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
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>List PNS</span>
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
                  // dataSource={tableData.data}
                  dataSource={dataDummy}
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
        </>
      ) : (
        <Row>
          <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>Daftar Pinjaman</span>
          </Col>
          <Col span={24}>
            {/* {loanList.data.map((item, key) => (
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
            ))} */}
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
