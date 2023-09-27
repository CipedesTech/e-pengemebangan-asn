/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';

import AppLayout from 'layouts/app-layout';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  message,
  Progress,
  Row,
  Skeleton,
  Switch,
  TimePicker,
  Typography,
  Upload,
} from 'antd';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import VisitScheduleService from 'services/VisitScheduleService';
import { InboxOutlined } from '@ant-design/icons';
import DataSubmissionService from 'services/DataSubmissionService';
import moment from 'moment';
import DataConfirmationService from 'services/DataConfirmationService';
import { useRouter } from 'next/router';
import LoanListService from 'services/LoanListService';

const { TextArea } = Input;
const { Text } = Typography;
const { Dragger } = Upload;

function Pengajuan4() {
  const router = useRouter();
  const { loanId } = router.query;
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [idVisit, setIdVisit] = useState(0);
  const [detailVisit, setDetailVisit] = useState({});
  const [statusCatatan, setStatusCatatan] = useState(false);
  const [statusKonfirmasi, setStatusKonfirmasi] = useState(null);
  const [fileHistory, setFileHistory] = useState([]);

  const [state, setState] = useState({
    form: {
      fileList: [],
    },
  });

  const [progress, setProgress] = useState(null);
  const [pinjaman, setPinjaman] = useState({});

  const fetchLoanDetail = () => {
    setLoading(true);
    LoanListService.getDetailUserLoanListNonGateway({
      loanId,
    })
      .then((res) => {
        setPinjaman(res.data);
      });
  };

  useEffect(() => {
    if (loanId) {
      fetchLoanDetail();
    }
  }, [loanId]);

  const fetchProgress = () => {
    DataSubmissionService.getProgress(pinjaman.pinjaman_id)
      .then((res) => setProgress(res.progress))
      .catch((err) => err.pesan);
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) fetchProgress();
  }, []);

  const fetchPertanyaanAnalis = () => {
    setLoading(true);
    DataConfirmationService.getVerifikasiAnalyst({
      id: pinjaman.pinjaman_id,
    }).then((res) => {
      if (res.resultApproval !== null) {
        setStatusKonfirmasi(res.resultApproval?.analyst_acc);
      }
    }).catch((err) => {
      message.error(err.data);
    }).finally(() => {
      setLoading(false);
    });
  };

  const fetchVisitSchedule = () => {
    setLoading(true);

    VisitScheduleService.getOwnVisitScheduleBorrower(pinjaman.pinjaman_id)
      .then((res) => {
        setData(res.data);
      }).catch((err) => {
        message.error(err.data?.message);
        setData(null);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) {
      fetchProgress();
      if (user?.type === 'borrower') {
        fetchVisitSchedule();
      }
    }
  }, [pinjaman]);

  const fetchDetail = () => {
    setLoading(true);
    VisitScheduleService.getDetailVisitAdmin(pinjaman.pinjaman_id)
      .then((res) => {
        setFileHistory(res.data.AssetsVisitResults);
        setDetailVisit(res.data);
        setIdVisit(res.data?.id);
        form.setFieldsValue({
          date: moment(res.data.date),
          time: moment(res.data.time, 'HH:mm:ss'),
        });
      })
      .catch(() => {
        // message.error(err.data.message);
        setDetailVisit(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) {
      if (user?.data?.userRole === 1 || user?.data?.userRole === 2 || user?.data?.userRole === 9) {
        fetchPertanyaanAnalis();
      }
    }
  }, [pinjaman]);

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) {
      if (user?.data?.userRole === 1 || user?.data?.userRole === 2 || user?.data?.userRole === 9) {
        if (statusKonfirmasi) fetchDetail();
      }
    }
  }, [statusKonfirmasi]);

  const onSubmit = (values) => {
    // eslint-disable-next-line no-param-reassign
    delete values.status_catatan_visit;

    let payload = {};

    if (user?.type === 'admin' && (user?.data?.userRole === 1 || user?.data?.userRole === 9)) {
      payload = {
        pinjaman_id: pinjaman.pinjaman_id,
        date: dayjs(values.date).format('YYYY-MM-DD'),
        time: dayjs(values.time).format('hh:mm'),
        notes: values.notes !== undefined ? values.notes : null,
      };
    }

    setLoading(true);
    VisitScheduleService.postScheduleVisitAdmin({
      data: payload,
    }).then((res) => {
      message.success(res);
      fetchDetail();
    }).catch((err) => {
      message.error(err);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleUpload = {
    name: 'file',
    accept: '.doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      const fileList = [...info.fileList];
      const formData = new FormData();

      formData.append('visit_result_file', info.file);

      setState((prevState) => ({
        ...prevState,
        form: {
          ...prevState.form,
          fileList,
        },
      }));

      setLoading(true);
      VisitScheduleService.postUploadVisitResult({
        id: idVisit,
        data: formData,
      }).then(() => {
        message.success('Berhasil Upload');
        fetchDetail();
      }).catch(() => message.error('Gagal Upload'))
        .finally(() => setLoading(false));
    },
    onRemove: (file) => {
      setState((prevState) => {
        const index = prevState.form.fileList.indexOf(file);
        const newFileList = prevState.form.fileList.slice();
        newFileList.splice(index, 1);

        return {
          ...prevState,
          form: {
            ...prevState.form,
            fileList: newFileList,
          },
        };
      });
    },
    fileList: state.form.fileList.originFileObj,
  };

  const onDeleteFilePertanyaan = (idFile) => {
    VisitScheduleService.deleteFilePertanyaan({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      message.success('Berhasil Menghapus File');
      fetchDetail();
    }).catch(() => message.error('Gagal Hapus File'));
  };

  return (
    <>
      <Progress
        className='mt-3'
        percent={progress}
        status='active'
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
      <Divider />
      <div>
        {(user?.type === 'borrower') ? (
          <>
            <Card title={t('Visit Schedule')} loading={loading}>
              <Row gutter={ROW_GUTTER}>
                <Col span={6}>
                  Date
                </Col>
                <Col span={3}>
                  Time
                </Col>
              </Row>
              <Row gutter={ROW_GUTTER} className='mt-2'>
                <Col span={6}>
                  {/* <Input defaultValue={dayjs().format('YYYY-MM-DD')} /> */}
                  <Text strong>{data !== null && data[0]?.Visits[0]?.date}</Text>
                </Col>
                <Col span={3}>
                  {/* <Input defaultValue={dayjs().format('HH:mm')} /> */}
                  <Text strong>{data != null && data[0]?.Visits[0]?.time}</Text>
                </Col>
              </Row>
              <Row gutter={ROW_GUTTER} className='mt-4'>
                <Col span={24}>
                  Note
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col span={24}>
                  <Text strong>
                    {data != null && `Visit akan dilaksanakan pada tanggal ${data[0]?.Visits[0]?.date} pukul ${data[0]?.Visits[0]?.time}`}
                  </Text>
                </Col>
              </Row>
            </Card>
            <Card className='mt-2' title={t('Visit Notes')}>
              <Text>
                {data != null && data[0]?.Visits[0]?.notes ? data[0]?.Visits[0]?.notes.split('\n').map((item, key) => (
                  <Text key={key}>{item}
                    <br />
                  </Text>
                )) : '-'}
              </Text>
            </Card>
          </>
        ) : (user?.type === 'admin') ? (
          <>
            <Card title='Visit Schedule' loading={loading}>
              <Form form={form} layout='vertical' autoComplete='off' onFinish={onSubmit}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Form.Item
                      name='date'
                      label='Tanggal'
                      initialValue={moment(detailVisit?.date)}
                      rules={[
                        { required: true, message: t('validation:required', { field: 'Tanggal' }) },
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='time'
                      label='Waktu'
                      initialValue={dayjs(detailVisit?.time)}
                      rules={[
                        { required: true, message: t('validation:required', { field: 'Waktu' }) },
                      ]}
                    >
                      <TimePicker />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name='status_catatan_visit'
                  label='Catatan Visit'
                  initialValue={detailVisit?.notes != null}
                // rules={[
                //   { required: true, message: t('validation:required', { field: 'Catatan Visit' }) },
                // ]}
                >
                  <Switch onChange={(e) => setStatusCatatan(e)} />
                </Form.Item>
                {statusCatatan === true && (
                  <Form.Item
                    name='notes'
                    label=''
                    initialValue={detailVisit?.notes}
                    rules={[
                      { required: true, message: t('validation:required', { field: 'Catatan Visit' }) },
                    ]}
                  >
                    <TextArea rows={6} placeholder='Isi Catatan' />
                  </Form.Item>
                )}
                <Form.Item className='mb-0 mt-4'>
                  <Row>
                    <Col span={3}>
                      <Button
                        type='primary'
                        size='large'
                        htmlType='submit'
                        block
                        disabled={statusKonfirmasi === null || pinjaman?.status === 2}
                        style={{ borderRadius: 6 }}
                      >
                        Set
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
            <Card title='Visit Schedule'>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Text strong>Tanggal : </Text>
                  <Text>{moment(detailVisit?.date).format('YYYY-MM-DD') || '-'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Waktu : </Text>
                  <Text>{detailVisit?.time || '-'}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Catatan : </Text>
                  <br />
                  <Text>
                    {detailVisit?.notes ? detailVisit?.notes.split('\n').map((item, key) => (
                      <Text key={key}>{item}
                        <br />
                      </Text>
                    )) : '-'}
                  </Text>
                </Col>
              </Row>
            </Card>
            <Card title='Unggah Visit Result'>
              <Dragger {...handleUpload} disabled={detailVisit === null || statusKonfirmasi === null || pinjaman?.status === 2}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                <p className='ant-upload-hint'>
                  Hanya menerima file dalam bentuk .doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png
                </p>
              </Dragger>
              {fileHistory.length >= 1 && (
                <List
                  className='mt-2'
                  bordered
                  itemLayout='horizontal'
                  dataSource={fileHistory}
                  renderItem={(childs, indexs) => (
                    <List.Item
                      key={indexs}
                      actions={[
                        <Button type='link' onClick={() => onDeleteFilePertanyaan(childs.id)} style={{ color: 'red' }} key={indexs}>Hapus</Button>,
                        <Button type='link' key={indexs}><a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                      ]}
                    >
                      <Skeleton title={false} loading={loading} active={loading}>
                        <List.Item.Meta
                          title={<a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>{childs.file_name}</a>}
                        />
                        {/* <a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>Lihat File</a> */}
                      </Skeleton>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}

Pengajuan4.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={4}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan4;
