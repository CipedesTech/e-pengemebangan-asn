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
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Divider, Empty,
  Radio,
  Cascader,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
} from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

function RencanaPengembangan1() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);

  const [jabatan, setJabatan] = useState({
    JPT: false,
    Administrator: false,
    Pengawas: false,
    Fungsional: false,
    Pelaksana: false,
  });

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

  useEffect(() => {
    console.log('LIST-PNS');
  }, [params]);

  const onDetail = (record) => {
    console.log(record);
  };

  const onPageChange = (page, pageSize) => {
    setParams((prevParam) => ({
      ...prevParam,
      page,
      limit: pageSize,
    }));
  };

  const onFormLayoutChange = (value) => {
    console.log(value);
  };

  // NAMA SECTION
  const onChangeNama = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearchNama = (value) => {
    console.log('search:', value);
  };
  const filterOptionNama = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // PANGKAT SECTION
  const handleChangePangkat = (value) => {
    console.log(`selected ${value}`);
  };

  // UNITKERJA SECTION
  const handleChangeUnitKerja = (value) => {
    console.log(`selected ${value}`);
  };

  const onFinishForm = (e) => {
    router.push('/rencana-pengembangan/2');
  };

  const onChangeJabatan = (label, value) => {
    if (label === 'JPT') {
      setJabatan({
        ...jabatan,
        JPT: value.target.checked,
      });
    } else if (label === 'Administrator') {
      setJabatan({
        ...jabatan,
        Administrator: value.target.checked,
      });
    } else if (label === 'Pengawas') {
      setJabatan({
        ...jabatan,
        Pengawas: value.target.checked,
      });
    } else if (label === 'Fungsional') {
      setJabatan({
        ...jabatan,
        Fungsional: value.target.checked,
      });
    } else if (label === 'Pelaksana') {
      setJabatan({
        ...jabatan,
        Pelaksana: value.target.checked,
      });
    } else {
      setJabatan({
        ...jabatan,
      });
    }
  };

  console.log(jabatan);

  return (
    <div className='cards-container' style={{ backgroundColor: 'whitesmoke' }}>
      <Row>
        <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>Pendataan Pengembangan</span>
        </Col>
        {/* <Col span={24} className='px-4 py-4'>
          <Form form={form} layout='vertical' autoComplete='off' onFinish={(onSubmit) => console.log(onSubmit)}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name='transaksi_id'
                  label={t('Transaksi ID')}
                >
                  <Input placeholder='Masukkan Transaksi ID' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='nama'
                  label={t('Borrower Name')}
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
                    <Button type='danger' onClick={() => console.log('')}>
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
            <Form
              layout='vertical'
              onValuesChange={onFormLayoutChange}
              name='basic'
              initialValues={{ remember: true }}
              onFinish={onFinishForm}
              autoComplete='off'
            >
              <Form.Item label='Nama'>
                <Select
                  showSearch
                  placeholder='Select Nama'
                  optionFilterProp='children'
                  onChange={onChangeNama}
                  onSearch={onSearchNama}
                  filterOption={filterOptionNama}
                  options={[
                    {
                      value: '1',
                      label: 'Nama 1',
                    },
                    {
                      value: '2',
                      label: 'Nama 2',
                    },
                    {
                      value: '3',
                      label: 'Nama 3',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label='NIP'>
                <Input placeholder='NIP' />
              </Form.Item>
              <Form.Item label='Pangkat/Golongan'>
                <Select
                  defaultValue='brigadir'
                  style={{
                    width: 120,
                  }}
                  onChange={handleChangePangkat}
                  options={[
                    {
                      value: 'brigadir',
                      label: 'Brigadir',
                    },
                    {
                      value: 'letkol',
                      label: 'Letkol',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name='labels' label='Pendidikan Terakhir'>
                <Radio.Group>
                  <Radio value='SMP'> SMP </Radio>
                  <Radio value='SMA'> SMA </Radio>
                  <Radio value='D-III'> D-III </Radio>
                  <Radio value='D-IV/S-1'> D-IV/S-1 </Radio>
                  <Radio value='S-2'> S-2</Radio>
                  <Radio value='S-3'> S-3</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='Unit Kerja'>
                <Select
                  defaultValue='satuan1'
                  onChange={handleChangeUnitKerja}
                  options={[
                    {
                      value: 'satuan1',
                      label: 'Satuan 1',
                    },
                    {
                      value: 'satuan2',
                      label: 'Satuan 2',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name='labels' label='Jabatan'>
                <Checkbox.Group style={{ width: '100%' }}>
                  <Col span={24}>
                    <Row>
                      <Checkbox value='jpt' onChange={(e) => onChangeJabatan('JPT', e)}>JPT</Checkbox>
                      {jabatan.JPT && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih JPT'
                          options={[
                            {
                              value: 'satuan1',
                              label: 'Satuan 1',
                            },
                            {
                              value: 'satuan2',
                              label: 'Satuan 2',
                            },
                          ]}
                        />
                      )}
                    </Row>
                    <Row>
                      <Checkbox value='admin' onChange={(e) => onChangeJabatan('Administrator', e)}>Administrator</Checkbox>
                      {jabatan.Administrator && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Admin'
                          options={[
                            {
                              value: 'satuan1',
                              label: 'Satuan 1',
                            },
                            {
                              value: 'satuan2',
                              label: 'Satuan 2',
                            },
                          ]}
                        />
                      )}
                    </Row>
                    <Row>
                      <Checkbox value='pengawas' onChange={(e) => onChangeJabatan('Pengawas', e)}>Pengawas</Checkbox>
                      {jabatan.Pengawas && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Pengawas'
                          options={[
                            {
                              value: 'satuan1',
                              label: 'Satuan 1',
                            },
                            {
                              value: 'satuan2',
                              label: 'Satuan 2',
                            },
                          ]}
                        />
                      )}
                    </Row>
                    <Row>
                      <Checkbox value='fungsional' onChange={(e) => onChangeJabatan('Fungsional', e)}>Fungsional</Checkbox>
                      {jabatan.Fungsional && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Fungsional'
                          options={[
                            {
                              value: 'satuan1',
                              label: 'Satuan 1',
                            },
                            {
                              value: 'satuan2',
                              label: 'Satuan 2',
                            },
                          ]}
                        />
                      )}
                    </Row>
                    <Row>
                      <Checkbox value='pelaksana' onChange={(e) => onChangeJabatan('Pelaksana', e)}>Pelaksana</Checkbox>
                      {jabatan.Pelaksana && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Pelaksana'
                          options={[
                            {
                              value: 'satuan1',
                              label: 'Satuan 1',
                            },
                            {
                              value: 'satuan2',
                              label: 'Satuan 2',
                            },
                          ]}
                        />
                      )}
                    </Row>

                  </Col>
                </Checkbox.Group>

              </Form.Item>
              {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}> */}
              <Form.Item>
                <Row>
                  <Col span={20}>
                    <div> </div>
                  </Col>
                  <Col span={4}>
                    <Button type='primary' htmlType='submit'>
                      Tambah Riwayat Diklat
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              {/* <Form.Item name='labels' label='7. Kebutuhan Pengembangan Kompetensi '>
                <Radio.Group>
                  <Space direction='vertical'>
                    <Radio value='Manajerial'>1. Manajerial </Radio>
                    <Radio value='Fungsional'>2. Fungsional </Radio>
                    <Radio value='Teknis'>3. Teknis </Radio>
                    <Radio value='Sosiokultural'>4. Sosiokultural </Radio>
                    <Radio value='Pemerintahan'>5. Pemerintahan</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <p style={{ color: '#1a3353', fontWeight: '600' }}>8. Bentuk pengembangan kompetensi yang akan diikuti</p>
              <Form.Item name='labels'>
                <Radio.Group>
                  <Radio value='Klasikal'>Klasikal</Radio>
                  <Radio value='Non Klasikal'>Non Klasikal</Radio>
                </Radio.Group>
              </Form.Item>
              <p style={{ color: '#1a3353', fontWeight: '600' }}>9. Bentuk Pengembangan Kompetensi Klasikal yang akan diikuti</p>
              <Form.Item name='labels'>
                <Radio.Group>
                  <Radio value='Tugas Belajar'>Tugas Belajar</Radio>
                  <Radio value='Pelatihan'>Pelatihan</Radio>
                  <Radio value='Workshop'>Workshop</Radio>
                  <Radio value='Seminar'>Seminar</Radio>
                  <Radio value='Bimtek'>Bimtek</Radio>
                  <Radio value='Kursus'>Kursus</Radio>
                  <Radio value='Penataran'>Penataran</Radio>
                  <Radio value='Konfrensi'>Konfrensi</Radio>
                  <Radio value='Sosialisasi'>Sosialisasi</Radio>
                  <Radio value='Lainnya'>Lainnya</Radio>
                </Radio.Group>
              </Form.Item>
              <p style={{ color: '#1a3353', fontWeight: '600' }}>10. Bentuk Pengembangan Kompetensi Non Klasikal yang akan diikuti</p>
              <Form.Item name='labels'>
                <Radio.Group>
                  <Radio value='Coaching'>Coaching</Radio>
                  <Radio value='Mentoring'>Mentoring</Radio>
                  <Radio value='E-Learning'>E-Learning</Radio>
                  <Radio value='Pelatihan Jarak Jauh'>Pelatihan Jarak Jauh</Radio>
                  <Radio value='Datasering'>Datasering</Radio>
                  <Radio value='Pembelajaran Alama Terbuka'>Pembelajaran Alama Terbuka</Radio>
                  <Radio value='Patokan Banding'>Patokan Banding</Radio>
                  <Radio value='Pertukaran Pegawai'>Pertukaran Pegawai</Radio>
                  <Radio value='Belajar Mandiri'>Belajar Mandiri</Radio>
                  <Radio value='Komunikasi Belajar'>Komunikasi Belajar</Radio>
                  <Radio value='Bimbingan di tempat Kerja'>Bimbingan di tempat Kerja</Radio>
                  <Radio value='Magang'>Magang</Radio>
                  <Radio value='Lainnya'>Lainnya</Radio>
                </Radio.Group>
              </Form.Item> */}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

RencanaPengembangan1.getLayout = function getLayout(page) {
  return (
    <AppLayout title='List PNS' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default RencanaPengembangan1;
