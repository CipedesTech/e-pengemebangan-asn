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
  Space,
  Tabs,
} from 'antd';
import AppLayout from 'layouts/app-layout';
import {
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import { ROW_GUTTER } from 'constants/ThemeConstant';
import dayjs from 'dayjs';
import QueryString from 'qs';
import DiklatService from 'services/DiklatService';
import PropTypes from 'prop-types';
import Cookies from 'utils/Cookies';
import axios from 'axios';

export async function getServerSideProps(ctx) {
  let diklats = [];
  try {
    const { API_URL } = process.env;
    const token = Cookies.getData('token', ctx);
    const diklat = await axios.get(`${API_URL}/api/master/diklat`, { params: { perPage: 2000 },
      headers: {
        Authorization: `Bearer ${token}`,
      } });
    if (diklat.status === 200) diklats = diklat.data.data.data.map((el) => ({ key: el.id, label: el.nama }));
  } catch (err) {
    console.log(err);
  }
  return { props: { diklats } };
}

function PelaksanaanDiklat({ diklats }) {
  const router = useRouter();
  const { t } = useTranslation();
  const query = QueryString.parse(window.location.search.split('?')[1]);

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    page: parseInt(query.page, 10) || 1,
    perPage: parseInt(query.perPage, 10) || 10,
    'where[diklat]': diklats[0],
  });

  const [tableData, setTableData] = useState({
    data: [],
    total: null,
  });
  const fetchData = async () => {
    setLoading(true);
    const res = await DiklatService.getAllPelaksanaanDiklat({ params });
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

  const onTabChange = (key) => {
    setParams((prevParam) => ({
      ...prevParam,
      'where[diklat]': key,
    }));
  };

  const onCreate = () => {
    router.push('/pelaksanaan-diklat/create');
  };

  const onDetail = (e) => {
    router.push(`/pelaksanaan-diklat/${e.id}`);
  };

  const columns = [
    {
      title: 'Nama diklat',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Kompetensi',
      // eslint-disable-next-line no-unused-vars
      render: (text, record, index) => {
        return record.Diklat.nama;
      },
    },
    {
      title: 'Pagu',
      dataIndex: 'pagu',
      key: 'pagu',
    },
    {
      title: 'Kuota',
      dataIndex: 'kuota',
      key: 'kuota',
    },
    {
      title: 'Tanggal direncanakan',
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
  console.log('DIKLATS', diklats);
  return (
    <Row gutter={ROW_GUTTER}>
      <Col span={24}>
        <div className='d-flex align-items-center justify-content-end'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => onCreate()}
          >
            {`${t('button:create')} Pelaksanaan Diklat`}
          </Button>

        </div>
      </Col>
      <Col span={24}>
        <Tabs
          defaultActiveKey='1'
          onChange={onTabChange}
          items={diklats}
        />
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
  );
}

PelaksanaanDiklat.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Diklat' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

PelaksanaanDiklat.propTypes = {
  diklats: PropTypes.array.isRequired,
};

export default PelaksanaanDiklat;
