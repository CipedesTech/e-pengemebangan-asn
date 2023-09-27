/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';

import AppLayout from 'layouts/app-layout';

import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Switch,
  Typography,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DataConfirmationService from 'services/DataConfirmationService';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import DataSubmissionService from 'services/DataSubmissionService';
import { useRouter } from 'next/router';
import LoanListService from 'services/LoanListService';

const { Text, Title } = Typography;
const { TextArea } = Input;

function Pengajuan3() {
  const router = useRouter();
  const { loanId } = router.query;
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [peringatanPengajuan, setPeringatanPengajuan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pertanyaan, setPertanyaan] = useState([]);
  const [dataSubmit, setDataSubmit] = useState(null);
  const [pertanyaanAnalis, setPertanyaanAnalis] = useState([]);
  const [question, setQuestion] = useState([{
    id: uuidv4,
    pertanyaan: null,
    unggah_file: false,
  }]);
  const [state, setState] = useState({
    form: {
      fileList: [],
    },
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifikasiDone, setVerifikasiDone] = useState(false);
  const [verifikasiSubmission, setVerifikasiSubmission] = useState(null);
  const [verifikasiBorrowerDone, setVerifikasiBorrowerDone] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [statusKonfirmasi, setStatusKonfirmasi] = useState({
    analyst_acc: false,
    comment_reject: '',
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const [progress, setProgress] = useState(null);
  const [rejectionNotesBorrower, setRejectionNotesBorrower] = useState(null);

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
      .catch(() => message.error());
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) fetchProgress();
  }, [pinjaman]);

  const fetchSubmission = () => {
    setLoading(true);
    DataSubmissionService.getDetailSubmissionUser(pinjaman.pinjaman_id)
      .then((res) => {
        if (res.status_verifikasi !== 0) {
          setVerifikasiDone(true);
        }
        setVerifikasiSubmission(res.status_verifikasi);
        setRejectionNotesBorrower(res.catatan_submisi?.catatan_tambahan);
      }).finally(() => {
        setLoading(false);
      });
  };

  const fetchPertanyaan = (pass = false) => {
    setLoading(true);
    DataConfirmationService.getListPertanyaanBorrower({
      id: pinjaman.pinjaman_id,
    }).then((res) => {
      setPertanyaan(res.data);
      setVerifikasiBorrowerDone(res.status_verifikasi_data);
      if (res.status_konfirmasi_borrower === false && pass !== true) {
        setPeringatanPengajuan(true);
      }
      setRejectionNotesBorrower(res.catatan_rejection);
    }).catch((err) => {
      message.error(err?.data?.pesan);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user?.type === 'borrower' && pinjaman.pinjaman_id !== undefined) {
      fetchPertanyaan();
    }
  }, [pinjaman]);

  const fetchPertanyaanAnalis = () => {
    setLoading(true);
    DataConfirmationService.getVerifikasiAnalyst({
      id: pinjaman.pinjaman_id,
    }).then((res) => {
      if (res.resultApproval !== null) {
        setStatusKonfirmasi(res.resultApproval);
      }
      setPertanyaanAnalis(res?.data[0]?.Pertanyaans !== undefined ? res?.data[0]?.Pertanyaans : []);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) {
      if (user?.data?.userRole === 9 || user?.data?.userRole === 2 || user?.data?.userRole === 1) {
        fetchSubmission();
        fetchPertanyaanAnalis();
      }
    }
  }, [pinjaman]);

  const handleUpload = {
    name: 'file',
    accept: '.doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png',
    multiple: true,
    beforeUpload: () => {
      return false;
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
    showUploadList: false,
  };

  const onUpload = (info, pinjamanId, pertanyaanId) => {
    const fileList = [...info.fileList];
    const formData = new FormData();

    setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        fileList,
      },
    }));

    if (user?.type === 'borrower') {
      formData.append('file_upload', info.file);
      formData.append('pinjaman_id', pinjamanId);

      DataConfirmationService.postUploadFileBorrower({
        id: pertanyaanId,
        data: formData,
      }).then(() => {
        message.success('Berhasil Upload');
        fetchPertanyaan(true);
      }).catch(() => message.error('Gagal Upload'));
    }
  };

  const onChangeQuestion = (rowId, field, value) => {
    const newData = [...question];
    const index = newData.findIndex((item) => rowId === item.id);

    newData[index][field] = value;

    setQuestion(newData);
  };

  const onRemoveQuestion = () => {
    const newQuestion = question.filter((element, index) => index < question.length - 1);

    setQuestion([...newQuestion]);
  };

  const onAddQuestion = () => {
    setQuestion((prevState) => ([
      ...prevState,
      {
        id: uuidv4,
        pertanyaan: null,
        unggah_file: false,
      },
    ]));
  };

  const onApprove = (status) => {
    DataConfirmationService.postApproveAnalyst({
      data: {
        pinjaman_id: pinjaman.pinjaman_id,
        analyst_acc: status,
        comment_reject: rejectionReason,
      },
    }).then(() => {
      message.success('Berhasil Konfirmasi Data');
      fetchPertanyaanAnalis();
      fetchProgress();
      router.push(`/pengajuan/${pinjaman.pinjaman_id}/4`);
    }).catch(() => {
      message.error('Gagal Konfirmasi Data');
    });
  };

  const onReject = () => {
    setLoading(true);

    if (user?.data?.userRole === 2 || user?.data?.userRole === 9) {
      DataSubmissionService.putNotesRejectionAdmin({
        id: pinjaman.pinjaman_id,
        data: {
          adminNotes: 'Mohon maaf, pengajuan Anda tidak disetujui. Terima kasih atas permohonan pinjaman Anda saat ini, permohonan pengajuan pinjaman Anda belum bisa disetujui.',
        },
      }).then(() => {
        fetchPertanyaanAnalis();
        fetchLoanDetail();
      }).catch((err) => message.error(err.pesan));
    } else {
      DataSubmissionService.putNotesRejectionAdmin({
        id: pinjaman.pinjaman_id,
        data: {
          adminNotes: rejectionReason,
        },
      }).then(() => {
        fetchPertanyaanAnalis();
        fetchLoanDetail();
      }).catch((err) => message.error(err.pesan));
    }
    setShowReject(false);
  };

  const onApproveDokumen = (idDokumen, statusDokumen) => {
    setLoading(true);
    DataConfirmationService.putApprovalDokumen({
      data: {
        id: idDokumen,
        approval: statusDokumen,
        pinjaman_id: pinjaman.pinjaman_id,
      },
    }).then(() => {
      if (statusDokumen === true) {
        message.success('Berhasil Approve Dokumen');
      } else {
        message.error('Dokumen Tidak Sesuai');
      }
      fetchPertanyaanAnalis();
    }).catch(() => {
      message.error('Gagal Approve Dokumen');
    }).finally(() => setLoading(false));
  };

  const onSubmit = (values) => {
    const newData = [];
    // eslint-disable-next-line no-restricted-syntax
    if (user?.type === 'borrower') {
      const keys = Object.keys(values);
      const id = [...new Set(keys.map((el) => el.split('_')[1], 10))];
      // eslint-disable-next-line no-restricted-syntax
      for (const ids of id) {
        const temp = {};
        keys.forEach((el) => {
          const split = el.split('_');
          if (split[1] === ids) {
            temp.id = parseInt(values[`id_${ids}`], 10);
            temp.jawaban = values[`jawaban_${ids}`];
          }
          newData.push(temp);
        });
      }
    } else {
      const keys = Object.keys(values);
      const id = [...new Set(keys.map((el) => el.split('_')[1], 10))];
      // eslint-disable-next-line no-restricted-syntax
      for (const ids of id) {
        const temp = {};
        keys.forEach((el) => {
          const split = el.split('_');
          if (split[1] === ids) {
            temp.pertanyaan = values[`pertanyaan_${ids}`];
            temp.unggah_file = values[`unggahfile_${ids}`];
          }
          newData.push(temp);
        });
      }
    }

    setDataSubmit(newData);
    setConfirmModal(true);

    // setLoading(true);
    // if (user?.type !== 'borrower') {
    //   DataConfirmationService.postPertanyaanAnalyst({
    //     id: pinjaman.pinjaman_id,
    //     data: {
    //       data: [...new Set(newData)],
    //     },
    //   }).then(() => {
    //     message.success('Berhasil Membuat Pertanyaan');
    //     fetchPertanyaanAnalis();
    //   }).catch((err) => {
    //     message.error(err.pesan);
    //   }).finally(() => {
    //     setLoading(false);
    //   });
    // } else {
    //   DataConfirmationService.putAddJawabanBorrower({
    //     id: pinjaman.pinjaman_id,
    //     data: {
    //       data: [...new Set(newData)],
    //     },
    //   }).then(() => message.success('Berhasil'))
    //     .catch(() => message.error('Gagal'))
    //     .finally(() => setLoading(false));
    // }
  };

  const onDeleteFilePertanyaan = (idFile) => {
    DataConfirmationService.deleteFilePertanyaan({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      message.success('Berhasil Menghapus File');
      fetchPertanyaanAnalis();
    }).catch(() => message.error('Gagal Hapus File'));
  };

  const submitPertanyaan = () => {
    setLoading(true);
    if (user?.type !== 'borrower') {
      DataConfirmationService.postPertanyaanAnalyst({
        id: pinjaman.pinjaman_id,
        data: {
          data: [...new Set(dataSubmit)],
        },
      }).then(() => {
        message.success('Berhasil Membuat Pertanyaan');
        fetchPertanyaanAnalis();
      }).catch((err) => {
        message.error(err.pesan);
      }).finally(() => {
        setConfirmModal(false);
        setLoading(false);
      });
    } else {
      DataConfirmationService.putAddJawabanBorrower({
        id: pinjaman.pinjaman_id,
        data: {
          data: [...new Set(dataSubmit)],
        },
      }).then(() => message.success('Berhasil Menjawab'))
        .catch(() => message.error('Gagal Menjawab'))
        .finally(() => {
          setConfirmModal(false);
          setLoading(false);
        });
    }
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
      {(user?.type === 'borrower') ? (
        <>
          <Card title='Data Confirmation' loading={loading}>
            <Form form={form} layout='vertical' autoComplete='off' onFinish={onSubmit}>
              {pertanyaan.length > 0 ? (
                <>
                  {pertanyaan.map((item, key) => (
                    <div key={key}>
                      {item.Pertanyaans?.length > 0 ? (
                        <>
                          {item.Pertanyaans.map((child, index) => (
                            <>
                              <Form.Item
                                name={`id_${index + 1}`}
                                label=''
                                initialValue={`${child.id}`}
                                style={{ display: 'none' }}
                              >
                                <Input style={{ display: 'none' }} className='mb-2' placeholder='Isi jawaban disini atau upload file' />
                              </Form.Item>
                              <Form.Item
                                name={`jawaban_${index + 1}`}
                                label={`${index + 1}. ${item.Pertanyaans[index].pertanyaan}`}
                                initialValue={item.Pertanyaans[index].jawaban}
                                className='mt-2'
                              >
                                <Input placeholder='Isi jawaban disini atau upload file' />
                              </Form.Item>
                              <Upload {...handleUpload} disabled={verifikasiBorrowerDone || pinjaman?.status === 2 || rejectionNotesBorrower !== null} onChange={(e) => onUpload(e, item.pinjaman_id, item.Pertanyaans[index].id)}>
                                <Button style={{ borderRadius: 6 }} disabled={verifikasiBorrowerDone} icon={<UploadOutlined />}>Upload File</Button>
                              </Upload>
                              {child.AssetsPertanyaans.length >= 1 && (
                                <List
                                  className='mt-2'
                                  bordered
                                  itemLayout='horizontal'
                                  dataSource={child.AssetsPertanyaans}
                                  renderItem={(childs, indexs) => (
                                    <List.Item key={indexs}>
                                      <Skeleton title={false} loading={loading} active={loading}>
                                        <List.Item.Meta
                                          avatar={<Image preview={false} width={30} src={childs.approval === true ? '/img/green-check-list.png' : childs.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                          title={<a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>{childs.file_name}</a>}
                                        />
                                        <a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>Lihat File</a>
                                      </Skeleton>
                                    </List.Item>
                                  )}
                                />
                              )}
                            </>
                          ))}
                        </>
                      ) : (
                        <Empty />
                      )}
                    </div>
                  ))}
                  <Form.Item className='mb-0 mt-4'>
                    <Row>
                      <Col span={3}>
                        <Button
                          type='primary'
                          size='large'
                          htmlType='submit'
                          disabled={user?.data?.userRole === 9 || verifikasiBorrowerDone || pinjaman?.status === 2 || rejectionNotesBorrower !== null}
                          block
                          style={{ borderRadius: 6 }}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              ) : (
                <Empty />
              )}
            </Form>
          </Card>
          {
            rejectionNotesBorrower === null || pinjaman.verifikasi === 2 ? <div />
              : (
                <Card title='Rejection Notes'>
                  <Text strong>Catatan dari IKI Modal</Text>
                  <br />
                  <Text>
                    {
                      rejectionNotesBorrower.split('\n').map((item, key) => (
                        <Text key={key}>{item}
                          <br />
                        </Text>
                      ))
                    }
                  </Text>
                </Card>
              )
          }
        </>
      ) : (user?.data?.userRole === 2 || user?.data?.userRole === 1 || user?.data?.userRole === 9) && (
        <>
          {pertanyaanAnalis.length < 1 ? (
            <Card title='Buat Pertanyaan Baru'>
              <Form form={form} layout='vertical' autoComplete='off' onFinish={onSubmit}>
                {question?.map((item, key) => (
                  <div key={key}>
                    <Form.Item
                      name={`pertanyaan_${key + 1}`}
                      label={`Pertanyaan Ke-${key + 1}`}
                      className='mt-2'
                      rules={[
                        { required: true, message: t('validation:required', { field: `Pertanyaan ke-${key + 1}` }) },
                      ]}
                    >
                      <Input
                        placeholder={t('placeholder:enter', { field: `Pertanyaan ke-${key + 1}` })}
                        onBlur={(e) => {
                          const { value } = e.target;
                          onChangeQuestion(item.id, 'pertanyaan', value);
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={`unggahfile_${key + 1}`}
                      label='Unggah File'
                      initialValue={false}
                    >
                      <Switch className='mb-3' />
                    </Form.Item>
                  </div>
                ))}
                {(user?.data?.userRole === 2 || user?.data?.userRole === 9) && (
                  <Form.Item className='mb-0'>
                    <Space size='middle'>
                      <Button type='primary' htmlType='submit' disabled={statusKonfirmasi.analyst_acc || verifikasiDone === false || pinjaman?.status === 2}>
                        {t('button:submit')}
                      </Button>
                      <Button onClick={onAddQuestion} disabled={statusKonfirmasi.analyst_acc || verifikasiDone === false || pinjaman?.status === 2}>
                        {t('Tambah Pertanyaan')}
                      </Button>
                      {question.length > 1 ? (
                        <Button onClick={onRemoveQuestion}>
                          {t('Kurangi Pertanyaan')}
                        </Button>
                      ) : (
                        <div />
                      )}
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </Card>
          ) : (
            <Card title='List Pertanyaan Yang Telah Dibuat'>
              <Form form={form} layout='vertical' autoComplete='off' onFinish={onSubmit}>
                {pertanyaanAnalis?.map((item, key) => (
                  <div key={key}>
                    <Form.Item
                      name={`pertanyaan_${key + 1}`}
                      label={`${key + 1}. ${item?.pertanyaan}`}
                      // initialValue={item.jawaban}
                      className='mt-3'
                      rules={[
                        { required: true, message: t('validation:required', { field: `Jawaban ke-${key + 1}` }) },
                      ]}
                    >
                      <Text hidden>
                        {item.jawaban}
                      </Text>
                      <Input
                        placeholder={t('placeholder:enter', { field: `Jawaban ke-${key + 1}` })}
                        disabled
                        value={item.jawaban}
                        onBlur={(e) => {
                          const { value } = e.target;
                          onChangeQuestion(item?.id, 'pertanyaan', value);
                        }}
                      />
                    </Form.Item>
                    {item?.AssetsPertanyaans.length >= 1 && (
                      <List
                        bordered
                        itemLayout='horizontal'
                        dataSource={item?.AssetsPertanyaans}
                        renderItem={(child, index) => (
                          <List.Item
                            actions={(user?.data?.userRole) && [
                              <Button type='link' onClick={() => onDeleteFilePertanyaan(child.id)} style={{ color: 'red' }} key={index}>Hapus</Button>,
                              <Button type='link' key={index}><a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                              <Button type='link' disabled={child.approval === true ? true : child.approval === false} onClick={() => onApproveDokumen(child.id, true)} key={index}>Dokumen Benar</Button>,
                              <Button type='link' disabled={child.approval === true ? true : child.approval === false} onClick={() => onApproveDokumen(child.id, false)} key={index}>Tidak Sesuai</Button>,
                            ]}
                          >
                            <Skeleton title={false} loading={loading} active={loading}>
                              <List.Item.Meta
                                avatar={<Image preview={false} width={30} src={child.approval === true ? '/img/green-check-list.png' : child.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                title={<a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>{child.file_name}</a>}
                              />
                              {/* <a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat File</a> */}
                            </Skeleton>
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                ))}
                {pertanyaanAnalis.length < 1 && (
                  <Form.Item className='mb-0' style={{ display: statusKonfirmasi.analyst_acc ? 'none' : null }}>
                    <Space size='middle'>
                      <Button type='primary' htmlType='submit'>
                        {t('button:submit')}
                      </Button>
                      <Button onClick={onAddQuestion}>
                        {t('Tambah Pertanyaan')}
                      </Button>
                      {question.length > 1 ? (
                        <Button onClick={onRemoveQuestion}>
                          {t('Kurangi Pertanyaan')}
                        </Button>
                      ) : (
                        <div />
                      )}
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </Card>
          )}
          <Card title='Rejection Notes'>
            <Text strong>Catatan dari Iki Modal</Text>
            <br />
            <Text>
              {statusKonfirmasi?.comment_reject ? statusKonfirmasi?.comment_reject.split('\n').map((item, key) => (
                <Text key={key}>{item}
                  <br />
                </Text>
              )) : rejectionNotesBorrower !== null && rejectionNotesBorrower !== undefined && verifikasiSubmission !== 2 ? rejectionNotesBorrower.split('\n').map((item, key) => (
                <Text key={key}>{item}
                  <br />
                </Text>
              )) : <Input className='my-2' placeholder='Isi catatan' value={rejectionReason} disabled />}
            </Text>
          </Card>
          {(user?.data?.userRole === 2 || user?.data?.userRole === 9) && (
            <Card title='Admin Action'>
              <Space size='middle'>
                <Button disabled={statusKonfirmasi.analyst_acc || verifikasiDone === false || pinjaman?.status === 2} type='primary' onClick={() => onApprove(true)}>
                  {t('Verify')}
                </Button>
                <Button disabled={statusKonfirmasi.analyst_acc || verifikasiDone === false || pinjaman?.status === 2} type='danger' onClick={() => setShowReject(true)}>
                  {t('Reject Pengajuan')}
                </Button>
              </Space>
            </Card>
          )}
          <Modal title='Reject Note' open={showReject} onCancel={() => setShowReject(false)} onOk={() => onReject()} okText='Reject' cancelText='Batal'>
            <p>Apakah anda yakin akan menolak Pengajuan?</p>
            <div className='flex-row' style={{ display: 'none' }}>
              <TextArea rows={6} placeholder='Isi Alasan Penolakan' onChange={(e) => setRejectionReason(e.target.value)} />
            </div>
          </Modal>
        </>
      )}
      <Modal
        closable={false}
        open={peringatanPengajuan}
        onOk={() => setPeringatanPengajuan(false)}
        footer={[
          <Button key='Submit' className='my-2' type='danger' block loading={loading} onClick={() => setPeringatanPengajuan(false)}>
            Saya Mengerti
          </Button>,
        ]}
      >
        <Image
          preview={false}
          style={{ padding: 48 }}
          src='/img/warning.png'
        />
        <Title style={{ color: 'red' }} className='text-center mt-4' level={3}>Segera Berikan Konfirmasi Anda</Title>
        <Title className='text-center' level={5}>Kelengkapan dokumen Anda mempengaruhi estimasi tanggal pencairan.</Title>
      </Modal>
      <Modal
        open={confirmModal}
        onOk={() => submitPertanyaan()}
        onCancel={() => setConfirmModal(false)}
        footer={[
          <Button key='Submit' className='my-2' type='danger' block loading={loading} onClick={() => submitPertanyaan()}>
            Lanjutkan
          </Button>,
        ]}
      >
        <Image
          preview={false}
          style={{ padding: 48 }}
          src='/img/warning.png'
        />
        <Title style={{ color: 'red' }} className='text-center mt-4' level={3}>Konfirmasi Data</Title>
        <Title className='text-center' level={5}>Data tidak bisa diubah setelah di submit.</Title>
      </Modal>
    </>
  );
}

Pengajuan3.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={3}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan3;
