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
    router.push('/rencana-pengembangan/diklat');
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
