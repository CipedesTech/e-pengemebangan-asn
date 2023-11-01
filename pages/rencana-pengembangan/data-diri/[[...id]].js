/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { useSelector } from 'react-redux';
import { useEffect, useState, createRef } from 'react';
import AppLayout from 'layouts/app-layout';
import PropTypes from 'prop-types';

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
import PnsService from 'services/PnsService';
// eslint-disable-next-line import/no-unresolved
import useDebounce from 'hooks/useDebounce';
import OpdService from 'services/OpdService';

const { Title, Paragraph, Text } = Typography;

export async function getServerSideProps() {
  let opds = [];
  try {
    const opd = await OpdService.getAll({ params: { perPage: 2000 } });
    if (opd.status === 200) opds = opd.data.data.data.map((el) => ({ value: el.nomenklatur_pada, label: el.nomenklatur_pada }));
  } catch (err) {
    console.log(err);
  }
  return { props: { opds } };
}

function RencanaPengembangan1({ opds }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const formRef = createRef();
  const { user } = useSelector((state) => state.auth);
  const [jabatan, setJabatan] = useState({
    JPT: false,
    Administrator: false,
    Pengawas: false,
    Fungsional: false,
    Pelaksana: false,
  });
  const [subJabatan, setSubjabatan] = useState('');
  const [jabatanCheck, setJabatanCheck] = useState(false);

  const [pnsList, setPnsList] = useState({
    data: [],
    raw: [],
    total: null,
  });

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    'where[nama_pegawai][contains]': '',
  });
  const debouncedSearchValue = useDebounce(params, 1000);
  const fetchPnsData = async () => {
    setLoading(true);
    const res = await PnsService.getAllPns({ params });
    const list = res.data.data.data.map((el) => ({ value: el.id, label: el.nama_pegawai }));
    setPnsList((prevParam) => ({
      ...prevParam,
      data: list,
      raw: res.data.data.data,
      total: res.data.data.meta.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    console.log('LIST-PNS');
    fetchPnsData();
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (user.role === 'UMPEG' && user.opd.nama !== 'master') {
      setParams((prevParam) => ({
        ...prevParam,
        'where[nomenklatur_pada]': user.opd.nama,
      }));
    }
  }, []);

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
    console.log('FORM..', value);
  };

  // NAMA SECTION
  const onChangeNama = (value) => {
    console.log(`selected ${value}`);
    const data = pnsList.raw.filter((el) => el.id === value)[0];
    const selectednip = data.nip_baru || '';
    const golongan = data.nama_golongan || '';
    const pendidikan = data.nama_jenjang_rumpun || '';
    const unitKerja = data.nomenklatur_pada || '';
    formRef.current.setFieldValue('nip', selectednip);
    formRef.current.setFieldValue('golongan', golongan);
    formRef.current.setFieldValue('pendidikan', pendidikan);
    formRef.current.setFieldValue('unit_kerja', unitKerja);
  };
  const onSearchNama = (value) => {
    console.log('search:', value);
    setParams((prevParam) => ({
      ...prevParam,
      'where[nama_pegawai][contains]': value,
    }));
  };
  const filterOptionNama = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // PANGKAT SECTION
  const handleChangePangkat = (value) => {
    console.log(`selected ${value}`);
  };

  // UNITKERJA SECTION
  const handleChangeUnitKerja = (value) => {
    console.log(`selected ${value}`);
    setSubjabatan(value);
  };

  const onFinishForm = async (e) => {
    const pengajuan = await PnsService.createPengajuan({ pegawaiId: e.name });
    console.log(pengajuan);
    console.log(e);
    router.push(`/rencana-pengembangan/diklat/${pengajuan.data.data.id}`);
  };

  const onChangeJabatan = (label, value) => {
    if (label === 'JPT') {
      setJabatan({
        ...jabatan,
        JPT: value.target.checked,
      });
      setJabatanCheck(value.target.checked);
    } else if (label === 'Administrator') {
      setJabatan({
        ...jabatan,
        Administrator: value.target.checked,
      });
      setJabatanCheck(value.target.checked);
    } else if (label === 'Pengawas') {
      setJabatan({
        ...jabatan,
        Pengawas: value.target.checked,
      });
      setJabatanCheck(value.target.checked);
    } else if (label === 'Fungsional') {
      setJabatan({
        ...jabatan,
        Fungsional: value.target.checked,
      });
      setJabatanCheck(value.target.checked);
    } else if (label === 'Pelaksana') {
      setJabatan({
        ...jabatan,
        Pelaksana: value.target.checked,
      });
      setJabatanCheck(value.target.checked);
    } else {
      setJabatan({
        ...jabatan,
      });
    }
  };

  const GolonganClassifications = [
    {
      value: 'I/a',
      label: 'I/a - Juru Muda',
    },
    {
      value: 'I/b',
      label: 'I/b - Juru Muda Tingkat I',
    },
    {
      value: 'I/c',
      label: 'I/c - Juru',
    },
    {
      value: 'I/d',
      label: 'I/d - Juru Tingkat I',
    },
    {
      value: 'II/a',
      label: 'II/a - Pengatur Muda',
    },
    {
      value: 'II/b',
      label: 'II/b - Pengatur Muda Tingkat I',
    },
    {
      value: 'II/c',
      label: 'II/c - Pengatur',
    },
    {
      value: 'II/d',
      label: 'II/d - Pengatur Tingkat I',
    },
    {
      value: 'III/a',
      label: 'III/a - Penata Muda',
    },
    {
      value: 'III/b',
      label: 'III/b - Penata Muda Tingkat I',
    },
    {
      value: 'III/c',
      label: 'III/c - Penata',
    },
    {
      value: 'III/d',
      label: 'III/d - Penata Tingkat I',
    },
    {
      value: 'IV/a',
      label: 'IV/a - Pembina',
    },
    {
      value: 'IV/b',
      label: 'IV/b - Pembina Tingkat I',
    },
    {
      value: 'IV/c',
      label: 'IV/c - Pembina Utama Muda',
    },
    {
      value: 'IV/d',
      label: 'IV/d - Pembina Utama Madya',
    },
    {
      value: 'IV/e',
      label: 'IV/e - Pembina Utama',
    },
  ];

  const EducationClassifications = [
    {
      value: 'D-II',
      label: 'D-II',
    },
    {
      value: 'D-III',
      label: 'D-III',
    },
    {
      value: 'D-IV',
      label: 'D-IV',
    },
    {
      value: 'Diploma I',
      label: 'Diploma I',
    },
    {
      value: 'Diploma II',
      label: 'Diploma II',
    },
    {
      value: 'Diploma III',
      label: 'Diploma III',
    },
    {
      value: 'Diploma IV',
      label: 'Diploma IV',
    },
    {
      value: 'S-1',
      label: 'S-1',
    },
    {
      value: 'S-2',
      label: 'S-2',
    },
    {
      value: 'S-3',
      label: 'S-3',
    },
    {
      value: 'Sekolah Dasar',
      label: 'Sekolah Dasar',
    },
    {
      value: 'Sekolah Menegah Pertama',
      label: 'Sekolah Menegah Pertama',
    },
    {
      value: 'Sekolah Menengah Atas',
      label: 'Sekolah Menengah Atas',
    },
  ];

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
              ref={formRef}
              form={form}
              layout='vertical'
              onValuesChange={onFormLayoutChange}
              name='basic'
              initialValues={{ remember: true }}
              onFinish={onFinishForm}
              autoComplete='off'
            >
              <Form.Item
                label='Nama'
                name='name'
                rules={[
                  { required: true },
                ]}
              >
                <Select
                  showSearch
                  placeholder='Select Nama'
                  optionFilterProp='children'
                  onChange={onChangeNama}
                  onSearch={onSearchNama}
                  filterOption={filterOptionNama}
                  options={pnsList.data}
                />
              </Form.Item>
              <Form.Item
                label='NIP'
                name='nip'
                rules={[
                  { required: true },
                ]}
              >
                <Input placeholder='nip' type='text' />
              </Form.Item>
              <Form.Item
                label='Pangkat/Golongan'
                name='golongan'
                rules={[
                  { required: true },
                ]}
              >
                <Select
                  style={{
                    width: '30%',
                  }}
                  onChange={handleChangePangkat}
                  options={GolonganClassifications}
                />
              </Form.Item>
              <Form.Item
                label='Pendidikan Terakhir'
                name='pendidikan'
                rules={[
                  { required: true },
                ]}
              >
                <Select
                  style={{
                    width: '30%',
                  }}
                  onChange={handleChangePangkat}
                  options={EducationClassifications}
                />
              </Form.Item>
              <Form.Item
                label='Unit Kerja'
                name='unit_kerja'
                rules={[
                  { required: true },
                ]}
              >
                <Select
                  onChange={handleChangeUnitKerja}
                  options={opds}
                />
              </Form.Item>
              <Form.Item
                label='Jabatan'
                name='jabatan'
                rules={[
                  { required: true },
                ]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Col span={24}>
                    <Row>
                      <Checkbox value='jpt' onChange={(e) => onChangeJabatan('JPT', e)} disabled={jabatanCheck && !jabatan.JPT}>JPT</Checkbox>
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
                      <Checkbox value='admin' onChange={(e) => onChangeJabatan('Administrator', e)} disabled={jabatanCheck && !jabatan.Administrator}>Administrator</Checkbox>
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
                      <Checkbox value='pengawas' onChange={(e) => onChangeJabatan('Pengawas', e)} disabled={jabatanCheck && !jabatan.Pengawas}>Pengawas</Checkbox>
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
                      <Checkbox value='fungsional' onChange={(e) => onChangeJabatan('Fungsional', e)} disabled={jabatanCheck && !jabatan.Fungsional}>Fungsional</Checkbox>
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
                      <Checkbox value='pelaksana' onChange={(e) => onChangeJabatan('Pelaksana', e)} disabled={jabatanCheck && !jabatan.Pelaksana}>Pelaksana</Checkbox>
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
                      Selanjutnya
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

RencanaPengembangan1.getLayout = function getLayout(page) {
  return (
    <AppLayout title='List PNS' extraDef='rencanaPengembangan' onTab='dataDiri'>
      {page}
    </AppLayout>
  );
};

RencanaPengembangan1.propTypes = {
  opds: PropTypes.array.isRequired,
};

export default RencanaPengembangan1;
