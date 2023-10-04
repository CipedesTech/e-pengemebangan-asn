import { useState } from 'react';
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
} from 'antd';
import AppLayout from 'layouts/app-layout';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { ROW_GUTTER } from 'constants/ThemeConstant';

const { confirm } = Modal;

function MasterDataDiklat() {
  const router = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    // counts: 0,
    // pageCount: 0,
    page_size: 10,
    page: 1,
  });

  const [response, setResponse] = useState({
    results: [],
    count: 0,
  });

  const [deleteId, setDeleteId] = useState(null);

  const onPageChange = (page, pageSize) => {
    setParams((prevParam) => ({
      ...prevParam,
      page,
      page_size: pageSize,
    }));
  };

  const onDelete = (id) => {
    confirm({
      title: t('Confirm'),
      content: t('placeholder:delete-confirmation'),
      icon: null,
      cancelText: t('button:cancel'),
      okType: 'danger',
      okText: t('button:delete'),
      okButtonProps: { type: 'primary' },
      onOk() {
        setDeleteId(id);
      },
    });
  };

  const onCreate = () => {
    router.push('/master-data/diklat/create');
  };

  const onEdit = (id) => {
    router.push(`/master-data/diklat/${id}/edit`);
  };

  const columns = [
    {
      title: t('Nama'),
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: t('Created At'),
      dataIndex: 'created_date',
      key: 'created_date',
    },
    {
      title: t('Action'),
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Space>
          <Tooltip placement='top' title={t('button:edit')}>
            <Button
              type='primary'
              size='small'
              className='ant-btn-dark'
              icon={<EditOutlined />}
              onClick={() => onEdit(record.id)}
            />
          </Tooltip>
          <Tooltip placement='top' title={t('button:delete')}>
            <Button
              danger
              type='primary'
              size='small'
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={ROW_GUTTER}>
      <Col span={24}>
        <div className='d-flex align-items-center justify-content-end'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => onCreate()}
          >
            {`${t('button:create')} Diklat`}
          </Button>

        </div>
      </Col>
      <Col span={24}>
        <Card className='card-table'>
          <Table
            loading={loading}
            columns={columns}
            dataSource={response.results}
            rowKey={(record) => record.id}
            scroll={{ x: 700 }}
            pagination={{
              total: response?.count,
              showTotal: (total, range) => t('placeholder:pagination', { start: range[0], end: range[1], total }),
              current: params.page,
              pageSize: params.page_size,
              onChange: onPageChange,
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}

MasterDataDiklat.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Diklat' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default MasterDataDiklat;
