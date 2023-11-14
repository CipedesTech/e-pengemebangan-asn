/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  Row,
  Col,
  Button,
  Card,
  Table,
  Tooltip,
  Modal,
  Space,
  Form,
  Input,
  message,
  Select,

} from 'antd';
import AppLayout from 'layouts/app-layout';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';

import { ROW_GUTTER } from 'constants/ThemeConstant';
import dayjs from 'dayjs';
import QueryString from 'qs';
import UserService from 'services/UserService';
import axios from 'axios';
import Cookies from 'utils/Cookies';

const { confirm } = Modal;

export async function getServerSideProps(ctx) {
  let roles = [];
  let opds = [];
  try {
    const { API_URL } = process.env;
    const token = Cookies.getData('token', ctx);
    const role = await axios.get(`${API_URL}/api/master/role`, { params: { perPage: 1000 },
      headers: {
        Authorization: `Bearer ${token}`,
      } });
    if (role.status === 200) roles = role.data.data.data.map((el) => ({ value: el.id, label: el.name }));
    const opd = await axios.get(`${API_URL}/api/master/opd`, { params: { perPage: 2000 },
      headers: {
        Authorization: `Bearer ${token}`,
      } });
    if (role.status === 200) opds = opd.data.data.data.map((el) => ({ value: el.id, label: el.nomenklatur_pada }));
  } catch (err) {
    console.log(err);
  }
  return { props: { roles, opds } };
}

function MasterRole({ roles, opds }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const query = QueryString.parse(window.location.search.split('?')[1]);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    type: null,
    data: {},
  });
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
    setLoading(true);
    const res = await UserService.getAll({ params });
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

  useEffect(() => {
    console.log(query);
  }, [query]);

  const onPageChange = (page, pageSize) => {
    router.push('', `?page=${page}&perPage=${pageSize}`, { scroll: false });
    setParams((prevParam) => ({
      ...prevParam,
      page,
      perPage: pageSize,
    }));
  };

  const onDelete = (data) => {
    confirm({
      title: t('Confirm'),
      content: t('placeholder:delete-confirmation'),
      icon: null,
      cancelText: t('button:cancel'),
      okType: 'danger',
      okText: t('button:delete'),
      okButtonProps: { type: 'primary' },
      async onOk() {
        setLoading(true);
        try {
          const role = await UserService.deleteById(data.id);
          message.success(role.data.message);
          fetchData();
        } catch (error) {
          message.error('terjadi kesalahan pada server');
        }
        setLoading(false);
      },
    });
  };
  const resetModal = () => {
    form.resetFields();
    setDetailModal({ isOpen: false, type: null, data: {} });
  };

  const onCreate = () => {
    setDetailModal({ isOpen: true, type: 'Tambah', data: {} });
  };

  const onDetail = (e) => {
    console.log(e);
    form.setFieldsValue(e);
    form.setFieldValue('opdId', e.Opd.id);
    form.setFieldValue('roleId', e.Role.id);
    setDetailModal({ isOpen: true, type: 'Perbarui', data: e });
  };

  const onFinishForm = async (e) => {
    setLoading(true);
    try {
      if (detailModal.type === 'Tambah') {
        const user = await UserService.create(e);
        if (user.status === 201) message.success(user.data.message);
      }
      if (detailModal.type === 'Perbarui') {
        const user = await UserService.update(detailModal.data.id, e);
        if (user.status === 202) message.success(user.data.message);
      }
      fetchData();
      resetModal();
    } catch (err) {
      console.log(err);
      return message.error('Terjadi kesalahan pada server');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'OPD',
      render: (text, record) => {
        return record.Opd.nomenklatur_pada;
      },
    },
    {
      title: 'Role',
      render: (text, record) => {
        return record.Role.name;
      },
    },
    {
      title: 'Tanggal ditambahkan',
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
          <Tooltip placement='top' title='Edit'>
            <Button
              type='primary'
              size='small'
              className='ant-btn-geekblue'
              icon={<EditOutlined />}
              onClick={() => onDetail(record)}
            />
          </Tooltip>
          <Tooltip placement='top' title='Hapus'>
            <Button
              type='primary'
              size='small'
              className='ant-btn-red'
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={ROW_GUTTER}>
        <Col span={24} className='px-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>Daftar Pengguna</span>
        </Col>
        <Col span={24}>
          <div className='d-flex align-items-center justify-content-end'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => onCreate()}
            >
              {`${t('button:create')} Pengguna`}
            </Button>

          </div>
        </Col>
        <Col span={24}>
          <Card className='card-table'>
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
        title={`${detailModal.type} Pengguna`}
        open={detailModal.isOpen}
        onCancel={() => resetModal()}
        footer={null}
      >
        <Form
          form={form}
          layout='vertical'
          name='basic'
          onFinish={onFinishForm}
          autoComplete='off'
        >
          <Form.Item
            label='nama'
            name='name'
            rules={[
              { required: true },
            ]}
          >
            <Input placeholder='Nama Pengguna' type='text' />
          </Form.Item>
          <Form.Item
            label='email'
            name='email'
            rules={[
              { required: true, type: 'email' },
            ]}
          >
            <Input placeholder='Email Pengguna' type='text' />
          </Form.Item>
          <Form.Item
            label='Roles'
            name='roleId'
            rules={[
              { required: true },
            ]}
          >
            <Select
              options={roles}
            />
          </Form.Item>
          <Form.Item
            label='OPD'
            name='opdId'
            rules={[
              { required: true },
            ]}
          >
            <Select
              options={opds}
            />
          </Form.Item>
          {detailModal.type === 'Perbarui' ? null : (
            <>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true },
                ]}
              >
                <Input placeholder='Email Pengguna' type='password' />
              </Form.Item>
              <Form.Item
                label='Konfirmasi Password'
                name='passwordMatch'
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Password tidak sama!'));
                    },
                  }),
                ]}
              >
                <Input placeholder='Email Pengguna' type='password' />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {`${detailModal.type} Pengguna`}
            </Button>
            <Button type='danger' style={{ marginLeft: '4px' }} onClick={() => resetModal()}>
              Batal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

MasterRole.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Peran' key={1} extra={false} onTab='null'>
      {page}
    </AppLayout>
  );
};

MasterRole.propTypes = {
  roles: PropTypes.array.isRequired,
  opds: PropTypes.array.isRequired,
};

export default MasterRole;
