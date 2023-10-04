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
  Input,
  Row,
  Select,
  Typography,
  Radio,
  Checkbox,
} from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph, Text } = Typography;

function RencanaPengembangan2() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);

  const [jabatan, setJabatan] = useState({
    Manajerial: false,
    Teknis: false,
    Sosiokultural: false,
    Fungsional: false,
    Pemerintah: false,
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
    console.log(e);
  };

  const onChangeJabatan = (label, value) => {
    if (label === 'Manajerial') {
      setJabatan({
        ...jabatan,
        Manajerial: value.target.checked,
      });
    } else if (label === 'Teknis') {
      setJabatan({
        ...jabatan,
        Teknis: value.target.checked,
      });
    } else if (label === 'Sosiokultural') {
      setJabatan({
        ...jabatan,
        Sosiokultural: value.target.checked,
      });
    } else if (label === 'Fungsional') {
      setJabatan({
        ...jabatan,
        Fungsional: value.target.checked,
      });
    } else if (label === 'Pemerintah') {
      setJabatan({
        ...jabatan,
        Pemerintah: value.target.checked,
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
              <Form.Item name='labels' label='Kebutuhan Pengembangan Kompetensi'>
                <Checkbox.Group style={{ width: '100%' }}>
                  <Col span={24}>
                    <Row>
                      <Checkbox value='jpt' onChange={(e) => onChangeJabatan('Manajerial', e)}>Manajerial</Checkbox>
                      {jabatan.Manajerial && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Manajerial'
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
                      <Checkbox value='admin' onChange={(e) => onChangeJabatan('Teknis', e)}>Teknis</Checkbox>
                      {jabatan.Teknis && (
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
                      <Checkbox value='pengawas' onChange={(e) => onChangeJabatan('Sosiokultural', e)}>Sosiokultural</Checkbox>
                      {jabatan.Sosiokultural && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Sosiokultural'
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
                      <Checkbox value='pelaksana' onChange={(e) => onChangeJabatan('Pemerintah', e)}>Pemerintah</Checkbox>
                      {jabatan.Pemerintah && (
                        <Select
                          onChange={handleChangeUnitKerja}
                          placeholder='Pilih Pemerintah'
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
              <Form.Item name='labels' label='Bentuk Pengembangan Kompetensi yang Akan Diikuti'>
                <Row>
                  <Col span={4}>
                    <Checkbox value='Klasikal' onChange={(e) => onChangeJabatan('Klasikal', e)}>Klasikal</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='NonKlasikal' onChange={(e) => onChangeJabatan('NonKlasikal', e)}>NonKlasikal</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Blended' onChange={(e) => onChangeJabatan('Blended', e)}>Blended</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item name='labels' label='Bentuk Pengembangan Kompetensi Klasikal yang Akan Diikuti'>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='TugasBelajar' onChange={(e) => onChangeJabatan('TugasBelajar', e)}>TugasBelajar</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Pelatihan' onChange={(e) => onChangeJabatan('Pelatihan', e)}>Pelatihan</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Workshop' onChange={(e) => onChangeJabatan('Workshop', e)}>Workshop</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Seminar' onChange={(e) => onChangeJabatan('Seminar', e)}>Seminar</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Bimtek' onChange={(e) => onChangeJabatan('Bimtek', e)}>Bimtek</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Kursus' onChange={(e) => onChangeJabatan('Kursus', e)}>Kursus</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Penataran' onChange={(e) => onChangeJabatan('Penataran', e)}>Penataran</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Konferensi' onChange={(e) => onChangeJabatan('Konferensi', e)}>Konferensi</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Sosialisasi' onChange={(e) => onChangeJabatan('Sosialisasi', e)}>Sosialisasi</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Lainnya' onChange={(e) => onChangeJabatan('Lainnya', e)}>Lainnya</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item name='labels' label='Bentuk Pengembangan Kompetensi Non Klasikal yang Akan Diikuti'>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Coaching' onChange={(e) => onChangeJabatan('Coaching', e)}>Coaching</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Mentoring' onChange={(e) => onChangeJabatan('Mentoring', e)}>Mentoring</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Elearning' onChange={(e) => onChangeJabatan('Elearning', e)}>Elearning</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Pelatihan Jarak Jauh' onChange={(e) => onChangeJabatan('Pelatihan Jarak Jauh', e)}>Pelatihan Jarak Jauh</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Datasering' onChange={(e) => onChangeJabatan('Datasering', e)}>Datasering</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='PembelajaranAlamTerbuka' onChange={(e) => onChangeJabatan('PembelajaranAlamTerbuka', e)}>Pembelajaran Alam Terbuka</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Patokan Banding' onChange={(e) => onChangeJabatan('Patokan Banding', e)}>Patokan Banding</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Pertukaran Pegawai' onChange={(e) => onChangeJabatan('Pertukaran Pegawai', e)}>Pertukaran Pegawai</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Belajar Mandiri' onChange={(e) => onChangeJabatan('Belajar Mandiri', e)}>Belajar Mandiri</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Komunikasi Belajar' onChange={(e) => onChangeJabatan('Komunikasi Belajar', e)}>Komunikasi Belajar</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Bimbingan di tempat Kerja' onChange={(e) => onChangeJabatan('Bimbingan di tempat Kerja', e)}>Bimbingan di tempat Kerja</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Magang' onChange={(e) => onChangeJabatan('Magang', e)}>Magang</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Lainnya' onChange={(e) => onChangeJabatan('Lainnya', e)}>Lainnya</Checkbox>
                  </Col>
                </Row>
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

RencanaPengembangan2.getLayout = function getLayout(page) {
  return (
    <AppLayout title='List PNS' extra={false}>
      {page}
    </AppLayout>
  );
};

export default RencanaPengembangan2;
