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
import qs from 'qs';
import PnsService from 'services/PnsService';

const { Title, Paragraph, Text } = Typography;

function ListASN() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  console.log('USER', user);
  const query = qs.parse(window.location.search.split('?')[1]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: parseInt(query.page, 10) || 1,
    perPage: parseInt(query.perPage, 10) || 10,
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const fetchData = async () => {
    const res = await PnsService.getAllPns({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data,
      total: res.data.data.meta.total,
    }));
  };

  useEffect(() => {
    if (user.role === 'UMPEG' && user.opd.nama !== 'master') {
      setParams((prevParam) => ({
        ...prevParam,
        'where[nomenklatur_pada]': user.opd.nama,
      }));
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('REFECTH');
    fetchData();
  }, [params]);

  useEffect(() => {
    console.log(query);
  }, [query]);

  const onDetail = (record) => {
    router.push(`list-pns/${record.id}`);
  };

  const onPageChange = (page, pageSize) => {
    router.push('', `?page=${page}&perPage=${pageSize}`, { scroll: false });
    setParams((prevParam) => ({
      ...prevParam,
      page,
      perPage: pageSize,
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
      dataIndex: 'nip_baru',
      key: 'nip_baru',
    },
    {
      title: 'Nama',
      dataIndex: 'nama_pegawai',
      key: 'nama_pegawai',
    },
    {
      title: 'Jabatan',
      dataIndex: 'nomenklatur_jabatan',
      key: 'nomenklatur_jabatan',
    },
    {
      title: 'Golongan',
      dataIndex: 'nama_golongan',
      key: 'nama_golongan',
    },
    {
      title: 'Instansi',
      dataIndex: 'nomenklatur_pada',
      key: 'nomenklatur_pada',
    },
    // {
    //   title: 'Status Kepegawaian',
    //   dataIndex: 'status_kepegawaian',
    //   key: 'status_kepegawaian',
    //   render: (text) => {
    //     return text === 'pns' ? <Tag color='geekblue'>{text}</Tag> : <Tag color='orange'>{text}</Tag>;
    //   },
    // },
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
    </div>
  );
}

ListASN.getLayout = function getLayout(page) {
  return (
    <AppLayout title='PNS' onTab='list_pns' extra={false}>
      {page}
    </AppLayout>
  );
};

export default ListASN;
