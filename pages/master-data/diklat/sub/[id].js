/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import {
  Card,
  Button,
  Form,
  Spin,
  Input,
  Table,
  Tag,
  Row,
  Col,
  Typography,
  Space,
  Tooltip,
  message,
  Modal,
  List,
  Divider,
} from 'antd';
import AppLayout from 'layouts/app-layout';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import MasterDiklatService from 'services/MasterDiklatService';
import QueryString from 'qs';
import MasterSubDiklatService from 'services/MasterSubDiklatService';

const { confirm } = Modal;
const { Text, Title } = Typography;

export async function getServerSideProps({ query }) {
  const { id } = query;
  let data = {};
  try {
    const res = await MasterDiklatService.getById(id);
    if (res.status === 200) data = res.data.data;
  } catch (err) {
    console.log(err);
  }
  return { props: { data } };
}

function MasterSubDiklat({ data }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
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
    'where[m_diklatId]': data.id,
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const [childeInp, setChildeInp] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const res = await MasterSubDiklatService.getAll({ params });
    setTableData((prevParam) => ({
      ...prevParam,
      data: res.data.data.data.map(({ children, ...keepAttrs }) => ({ child: children, ...keepAttrs })),
      total: res.data.data.meta.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    form2.setFieldsValue(data);
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

  const onChildInpAdd = () => {
    const tempData = detailModal.data;
    const inputVal = {
      label: childeInp,
      value: childeInp,
    };
    tempData.child = [...tempData.child, inputVal];
    setDetailModal((prev) => ({
      ...prev,
      data: tempData,
    }));
  };

  const onChildeDelete = (evt) => {
    const tempData = detailModal.data;
    tempData.child = detailModal.data.child.filter((el) => el.label !== evt);
    setDetailModal((prev) => ({
      ...prev,
      data: tempData,
    }));
  };

  const onDelete = (e) => {
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
          const role = await MasterSubDiklatService.deleteById(e.id);
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

  const onEdit = (e) => {
    form.setFieldsValue(e);
    setDetailModal({ isOpen: true, type: 'Perbarui', data: e });
  };

  const onFinishForm = async (e) => {
    setLoading(true);
    const body = { ...e, children: detailModal?.data?.child };
    try {
      if (detailModal.type === 'Tambah') {
        const role = await MasterSubDiklatService.create({ ...body, m_diklatId: data.id });
        if (role.status === 201) message.success(role.data.message);
      }
      if (detailModal.type === 'Perbarui') {
        const role = await MasterSubDiklatService.update(detailModal.data.id, { ...body, m_diklatId: data.id });
        if (role.status === 202) message.success(role.data.message);
      }
      fetchData();
      resetModal();
    } catch (err) {
      return message.error('Terjadi kesalahan pada server');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Nama Diklat',
      dataIndex: 'nama',
      key: 'nama',
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
              onClick={() => onEdit(record)}
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
        <Col span={24}>
          <div className='d-flex align-items-center justify-content-between'>
            <Text strong>SUB DIKLAT </Text>
            <div>
              <Button
                type='primary'
                icon={<ArrowLeftOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => router.back()}
              >
                Kembali
              </Button>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => onCreate()}
              >
                Tambah Sub Diklat
              </Button>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Card>
            <Spin spinning={loading}>
              <Form disabled form={form2} layout='vertical'>
                <Form.Item
                  name='nama'
                  label='Nama Diklat'
                >
                  <Input style={{ color: 'black' }} />
                </Form.Item>
              </Form>
            </Spin>
          </Card>
          {data?.id ? (
            <Card title='Daftar Sub Diklat'>
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
          ) : null}
        </Col>
      </Row>
      <Modal
        title={`${detailModal.type} Diklat`}
        open={detailModal.isOpen}
        onCancel={() => resetModal()}
        footer={null}
      >
        <Row gutter={ROW_GUTTER}>
          <Col span={24}>
            <Form
              form={form}
              layout='vertical'
              name='basic'
              onFinish={onFinishForm}
              autoComplete='off'
            >
              <Form.Item
                label='nama'
                name='nama'
                rules={[
                  { required: true },
                ]}
              >
                <Input placeholder='Nama Diklat' type='text' />
              </Form.Item>
              <Title level={4}>Child</Title>
              <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} value={childeInp} onChange={(e) => setChildeInp(e.target.value)} />
                <Button onClick={onChildInpAdd} type='primary'>Tambah</Button>
              </Input.Group>
              <List
                dataSource={detailModal?.data?.child}
                renderItem={(item) => (
                  <List.Item actions={[<Button key='delete' onClick={() => onChildeDelete(item.value)}><DeleteOutlined /></Button>]}>
                    <Text>{item.value}</Text>
                  </List.Item>
                )}
              />
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  {`${detailModal.type} Diklat`}
                </Button>
                <Button type='danger' style={{ marginLeft: '4px' }} onClick={() => resetModal()}>
                  Batal
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24} />
        </Row>
      </Modal>
    </>
  );
}

MasterSubDiklat.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Buat Diklat Baru' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

MasterSubDiklat.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MasterSubDiklat;
