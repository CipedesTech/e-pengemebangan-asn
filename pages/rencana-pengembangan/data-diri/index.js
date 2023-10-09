/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { useSelector } from 'react-redux';
import { useEffect, useState, createRef } from 'react';
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
import PnsService from 'services/PnsService';
import useDebounce from 'hooks/useDebounce';

const { Title, Paragraph, Text } = Typography;

function RencanaPengembangan1() {
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
  const [status, setStatus] = useState(0);
  const [loanList, setLoanList] = useState({
    data: [],
    total: 0,
  });

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    'where[nama_pegawai][contains]': '',
  });
  const debouncedSearchValue = useDebounce(params, 1000);
  const fetchPnsData = async () => {
    const res = await PnsService.getAllPns({ params });
    const list = res.data.data.data.map((el) => ({ value: el.id, label: el.nama_pegawai }));
    setPnsList((prevParam) => ({
      ...prevParam,
      data: list,
      raw: res.data.data.data,
      total: res.data.data.meta.total,
    }));
  };

  useEffect(() => {
    console.log('LIST-PNS');
    fetchPnsData({ params });
  }, [debouncedSearchValue]);

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
    const nip = pnsList.raw.filter((el) => el.id === value)[0];
    const selectednip = nip.nip || '';
    console.log(formRef.current.setFieldValue('nip', selectednip));
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
    { value: '1a', label: 'IA - Juru Muda' },
    { value: '1b', label: 'IB - Juru Muda Tingkat I' },
    { value: '1c', label: 'IC - Juru' },
    { value: '1d', label: 'ID - Juru Tingkat I' },
    { value: '2a', label: 'IIA - Pengatur Muda' },
    { value: '2b', label: 'IIB - Pengatur Muda Tingkat I' },
    { value: '2c', label: 'IIC - Pengatur' },
    { value: '2d', label: 'IID - Pengatur Tingkat I' },
    { value: '3a', label: 'IIIA - Penata Muda' },
    { value: '3b', label: 'IIIB - Penata Muda Tingkat I' },
    { value: '3c', label: 'IIIC - Penata' },
    { value: '3d', label: 'IIID - Penata Tingkat I' },
    { value: '4a', label: 'IVA - Pembina' },
    { value: '4b', label: 'IVB - Pembina Tingkat I' },
    { value: '4c', label: 'IVC - Pembina Muda' },
    { value: '4d', label: 'IVD - Pembina Madya' },
    { value: '4e', label: 'IVE - Pembina Utama' },
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
                <Radio.Group>
                  <Radio value='SMP'> SMP </Radio>
                  <Radio value='SMA'> SMA </Radio>
                  <Radio value='D-III'> D-III </Radio>
                  <Radio value='D-IV/S-1'> D-IV/S-1 </Radio>
                  <Radio value='S-2'> S-2</Radio>
                  <Radio value='S-3'> S-3</Radio>
                </Radio.Group>
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

RencanaPengembangan1.getLayout = function getLayout(page) {
  return (
    <AppLayout title='List PNS' extra={false}>
      {page}
    </AppLayout>
  );
};

export default RencanaPengembangan1;