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
  Space,
  message,
} from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import PnsService from 'services/PnsService';

const { Title, Paragraph, Text } = Typography;

function RencanaPengembangan2() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);

  const [kompetensiDiklat, setKompetensiDiklat] = useState({
    Manajerial: false,
    Teknis: false,
    Sosiokultural: false,
    Fungsional: false,
    Pemerintah: false,
  });
  const [kompetensiDiklatCheck, setKompetensiDiklatCheck] = useState(false);
  const [tipePengembangan, setTipePengembangan] = useState(3);
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

  const onFinishForm = async (e) => {
    const { id } = router.query;
    const pengajuan = await PnsService.updatePengajuan(id, { status: 'submit', diklat: e.kompetensi_diklat[0] });
    if (pengajuan.status !== 200) {
      return message.error('terjadi kesalahan');
    }
    console.log(pengajuan.status);
    console.log(e);
    message.success('berhasil menambahkan kandidat pelatihan');
    return router.push('/list-pns');
  };

  const onChangeKompetensiDiklat = (label, value) => {
    if (label === 'Manajerial') {
      setKompetensiDiklat({
        ...kompetensiDiklat,
        Manajerial: value.target.checked,
      });
      setKompetensiDiklatCheck(value.target.checked);
    } else if (label === 'Teknis') {
      setKompetensiDiklat({
        ...kompetensiDiklat,
        Teknis: value.target.checked,
      });
      setKompetensiDiklatCheck(value.target.checked);
    } else if (label === 'Sosiokultural') {
      setKompetensiDiklat({
        ...kompetensiDiklat,
        Sosiokultural: value.target.checked,
      });
      setKompetensiDiklatCheck(value.target.checked);
    } else if (label === 'Fungsional') {
      setKompetensiDiklat({
        ...kompetensiDiklat,
        Fungsional: value.target.checked,
      });
      setKompetensiDiklatCheck(value.target.checked);
    } else if (label === 'Pemerintah') {
      setKompetensiDiklat({
        ...kompetensiDiklat,
        Pemerintah: value.target.checked,
      });
      setKompetensiDiklatCheck(value.target.checked);
    } else {
      setKompetensiDiklat({
        ...kompetensiDiklat,
      });
    }
  };

  console.log(kompetensiDiklat);

  return (
    <div className='cards-container' style={{ backgroundColor: 'whitesmoke' }}>
      <Row>
        <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>Pendataan Pengembangan</span>
        </Col>
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
              <Form.Item name='kompetensi_diklat' label='Kebutuhan Pengembangan Kompetensi' rules={[{ required: true }]}>
                <Checkbox.Group style={{ width: '100%' }}>
                  <Col span={24}>
                    <Row>
                      <Checkbox value='jpt' onChange={(e) => onChangeKompetensiDiklat('Manajerial', e)} disabled={kompetensiDiklatCheck && !kompetensiDiklat.Manajerial}>Manajerial</Checkbox>
                      {kompetensiDiklat.Manajerial && (
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
                      <Checkbox value='admin' onChange={(e) => onChangeKompetensiDiklat('Teknis', e)} disabled={kompetensiDiklatCheck && !kompetensiDiklat.Teknis}>Teknis</Checkbox>
                      {kompetensiDiklat.Teknis && (
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
                      <Checkbox value='pengawas' onChange={(e) => onChangeKompetensiDiklat('Sosiokultural', e)} disabled={kompetensiDiklatCheck && !kompetensiDiklat.Sosiokultural}>Sosiokultural</Checkbox>
                      {kompetensiDiklat.Sosiokultural && (
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
                      <Checkbox value='fungsional' onChange={(e) => onChangeKompetensiDiklat('Fungsional', e)} disabled={kompetensiDiklatCheck && !kompetensiDiklat.Fungsional}>Fungsional</Checkbox>
                      {kompetensiDiklat.Fungsional && (
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
                      <Checkbox value='pelaksana' onChange={(e) => onChangeKompetensiDiklat('Pemerintah', e)} disabled={kompetensiDiklatCheck && !kompetensiDiklat.Pemerintah}>Pemerintah</Checkbox>
                      {kompetensiDiklat.Pemerintah && (
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
              <Form.Item name='tipe_kompetensi_diklat' label='Bentuk Pengembangan Kompetensi yang Akan Diikuti'>
                <Row>
                  <Radio.Group onChange={(e) => setTipePengembangan(parseInt(e.target.value, 10))}>
                    <Space direction='horizontal'>
                      <Radio value='0'>Klasikal</Radio>
                      <Radio value='1'>Non Klasikal</Radio>
                      <Radio value='2'>Blended</Radio>
                    </Space>
                  </Radio.Group>
                </Row>
              </Form.Item>
              <Form.Item name='kompetensi_klasikal' label='Bentuk Pengembangan Kompetensi Klasikal yang Akan Diikuti' disabled>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='TugasBelajar' onChange={(e) => onChangeKompetensiDiklat('TugasBelajar', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>TugasBelajar</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Pelatihan' onChange={(e) => onChangeKompetensiDiklat('Pelatihan', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Pelatihan</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Workshop' onChange={(e) => onChangeKompetensiDiklat('Workshop', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Workshop</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Seminar' onChange={(e) => onChangeKompetensiDiklat('Seminar', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Seminar</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Bimtek' onChange={(e) => onChangeKompetensiDiklat('Bimtek', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Bimtek</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Kursus' onChange={(e) => onChangeKompetensiDiklat('Kursus', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Kursus</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Penataran' onChange={(e) => onChangeKompetensiDiklat('Penataran', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Penataran</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Konferensi' onChange={(e) => onChangeKompetensiDiklat('Konferensi', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Konferensi</Checkbox>
                  </Col>
                  <Col span={4}>
                    <Checkbox value='Sosialisasi' onChange={(e) => onChangeKompetensiDiklat('Sosialisasi', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Sosialisasi</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={4}>
                    <Checkbox value='Lainnya' onChange={(e) => onChangeKompetensiDiklat('Lainnya', e)} disabled={tipePengembangan === 1 || tipePengembangan === 3}>Lainnya</Checkbox>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item name='kompetensi_non_klasikal' label='Bentuk Pengembangan Kompetensi Non Klasikal yang Akan Diikuti'>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Coaching' onChange={(e) => onChangeKompetensiDiklat('Coaching', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Coaching</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Mentoring' onChange={(e) => onChangeKompetensiDiklat('Mentoring', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Mentoring</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Elearning' onChange={(e) => onChangeKompetensiDiklat('Elearning', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Elearning</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Pelatihan Jarak Jauh' onChange={(e) => onChangeKompetensiDiklat('Pelatihan Jarak Jauh', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Pelatihan Jarak Jauh</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Datasering' onChange={(e) => onChangeKompetensiDiklat('Datasering', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Datasering</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='PembelajaranAlamTerbuka' onChange={(e) => onChangeKompetensiDiklat('PembelajaranAlamTerbuka', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Pembelajaran Alam Terbuka</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Patokan Banding' onChange={(e) => onChangeKompetensiDiklat('Patokan Banding', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Patokan Banding</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Pertukaran Pegawai' onChange={(e) => onChangeKompetensiDiklat('Pertukaran Pegawai', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Pertukaran Pegawai</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Belajar Mandiri' onChange={(e) => onChangeKompetensiDiklat('Belajar Mandiri', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Belajar Mandiri</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Komunikasi Belajar' onChange={(e) => onChangeKompetensiDiklat('Komunikasi Belajar', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Komunikasi Belajar</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Bimbingan di tempat Kerja' onChange={(e) => onChangeKompetensiDiklat('Bimbingan di tempat Kerja', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Bimbingan di tempat Kerja</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value='Magang' onChange={(e) => onChangeKompetensiDiklat('Magang', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Magang</Checkbox>
                  </Col>
                </Row>
                <Row gutter={[12, 12]}>
                  <Col span={6}>
                    <Checkbox value='Lainnya' onChange={(e) => onChangeKompetensiDiklat('Lainnya', e)} disabled={tipePengembangan === 0 || tipePengembangan === 3}>Lainnya</Checkbox>
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
