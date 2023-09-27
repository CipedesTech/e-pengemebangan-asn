/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';

import AppLayout from 'layouts/app-layout';

import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Progress,
  Row,
  Typography,
  message,
  Upload,
  Modal,
  Empty,
  Radio,
  Image,
  List,
  Skeleton,
} from 'antd';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import DataSubmissionService from 'services/DataSubmissionService';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { InboxOutlined } from '@ant-design/icons';
import DataConfirmationService from 'services/DataConfirmationService';
import { dateSubtractWeekDayOnly } from 'utils/Utils';
import LoanListService from 'services/LoanListService';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

function Pengajuan2() {
  const router = useRouter();
  const { loanId } = router.query;
  const [loading, setLoading] = useState(false);

  const [kategori, setKategori] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editIkiModal, setEditIkiModal] = useState(false);
  const [saveDisable, setSaveDisable] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifikasiDone, setVerifikasiDone] = useState(false);
  const [peringatanPengajuan, setPeringatanPengajuan] = useState(false);
  const [verifikasiAnalisModal, setVerifikasiAnalisModal] = useState(false);
  const [errorDrive, setErrorDrive] = useState(false);
  const [state, setState] = useState({
    form: {
      fileList: [],
    },
  });

  const [notesBorrower, setNotesBorrower] = useState(null);
  const [notesAdmin, setNotesAdmin] = useState(null);
  const [submissionBorrower, setSubmissionBorrower] = useState(null);
  const [linkDrive, setLinkDrive] = useState(null);
  const [executiveFile, setExecutiveFile] = useState(null);

  const [progress, setProgress] = useState(null);

  const { user } = useSelector((states) => states.auth);
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
      .catch(() => {
        setProgress(0);
      });
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) fetchProgress();
  }, [pinjaman]);

  const fetchSubmissionCategory = () => {
    DataSubmissionService.getKategoriSubmission()
      .then((res) => {
        setKategori(res);
      }).catch(() => {
        message.error('Gagal mengambil kategori');
      });
  };

  const fetchExecutiveFile = () => {
    DataSubmissionService.getExecutiveFile(pinjaman?.pinjaman_id)
      .then((res) => {
        setExecutiveFile(res.data);
      });
  };

  const fetchSubmission = () => {
    setLoading(true);
    DataSubmissionService.getDetailSubmissionUser(pinjaman?.pinjaman_id)
      .then((res) => {
        setSubmissionBorrower(res);
        setSaveDisable(false);
        if (res.status_verifikasi !== 0) {
          setVerifikasiDone(true);
        }
      }).catch(() => {
        fetchSubmissionCategory();
        setSaveDisable(true);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) {
      fetchExecutiveFile();
    }
  }, [pinjaman]);

  useEffect(() => {
    if (pinjaman.pinjaman_id) {
      fetchSubmission();
      if (user?.type === 'borrower' && verifikasiDone === false) setPeringatanPengajuan(!pinjaman.status_submisi);
    }
  }, [pinjaman]);

  const handleChange = (value, index, jenis) => {
    const newSubs = { ...submissionBorrower };
    if (user?.type === 'borrower') {
      if (index === 'all') {
        for (let i = 0; i < newSubs.data_submisi.length; i += 1) {
          newSubs.data_submisi[i].borrower_acc = value.target.checked;
        }
      } else {
        newSubs.data_submisi[index].borrower_acc = value.target.checked;
      }
    }
    if (user?.type === 'admin') {
      if (index === 'all') {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < newSubs.data_submisi.length; i += 1) {
          if (jenis === 0) {
            newSubs.data_submisi[i].borrower_acc = value.target.checked;
          } else {
            newSubs.data_submisi[i].admin_acc = value.target.value;
          }
        }
      } else if (jenis === 0) {
        newSubs.data_submisi[index].borrower_acc = value.target.checked;
      } else {
        newSubs.data_submisi[index].admin_acc = value.target.value;
      }
    }
    setSubmissionBorrower(newSubs);
  };

  const onSaveSubmission = () => {
    const temp = submissionBorrower;

    const newBorrowerAcc = temp.data_submisi.map((item) => item.borrower_acc);
    const newKategoriId = temp.data_submisi.map((item) => item.kategori_id);
    const newData = temp.data_submisi.map((item, index) => {
      return {
        kategori_id: newKategoriId[index],
        borrower_acc: newBorrowerAcc[index],
      };
    });

    delete temp.kategori;
    delete temp.admin_acc;
    delete temp.rejected;
    delete temp.catatan_submisi;
    delete temp.progress;
    delete temp.link_submisi;
    delete temp.status_verifikasi;
    delete temp.waktu_submisi;

    const payload = {
      pinjaman_id: pinjaman.pinjaman_id,
      data: newData,
    };

    setLoading(true);
    DataSubmissionService.postKategoriSubmission(payload)
      .then(() => {
        message.success('Berhasil Menyimpan Submisi');
        fetchSubmission();
        fetchProgress();
      }).catch(() => {
        message.error('Gagal Menyimpan Submisi');
      }).finally(() => {
        setLoading(false);
      });
  };

  const onSaveSubmissionAdminAcc = () => {
    const temp = submissionBorrower;

    const newBorrowerAcc = temp.data_submisi.map((item) => item.borrower_acc);
    const adminAcc = temp.data_submisi.map((item) => item.admin_acc);
    const newId = temp.data_submisi.map((item) => item.id);
    const newData = temp.data_submisi.map((item, index) => {
      return {
        id: newId[index],
        admin_acc: adminAcc[index],
        borrower_acc: newBorrowerAcc[index],
      };
    });

    delete temp.kategori;
    delete temp.borrower_acc;
    delete temp.rejected;
    delete temp.catatan_submisi;
    delete temp.progress;
    delete temp.link_submisi;
    delete temp.status_verifikasi;
    delete temp.waktu_submisi;

    const payload = {
      pinjaman_id: pinjaman.pinjaman_id,
      data: newData,
    };

    setLoading(true);
    DataSubmissionService.putKategoriSubmissionAdmin(payload)
      .then(() => {
        message.success('Berhasil Menyimpan Submisi');
        fetchSubmission();
        fetchProgress();
      }).catch(() => {
        message.error('Gagal Menyimpan Submisi');
      }).finally(() => {
        setLoading(false);
      });
  };

  const onChangeBorrowerNotes = (text) => {
    setNotesBorrower(text);
  };

  const onChangeAdminNotes = (text) => {
    setNotesAdmin(text);
  };

  const onSubmitNotesBorrower = () => {
    setLoading(true);
    DataSubmissionService.putNotesBorrower({
      id: pinjaman.pinjaman_id,
      data: {
        notes: notesBorrower,
      },
    }).then(() => {
      message.success('Berhasil Menyimpan Notes');
      fetchSubmission();
    }).catch(() => {
      message.error('Gagal Menyimpan Submisi');
    }).finally(() => {
      setLoading(false);
      setEdit(false);
    });
  };

  const onSubmitNotesAdmin = () => {
    setLoading(true);
    DataSubmissionService.putNotesBorrower({
      id: pinjaman.pinjaman_id,
      data: {
        notes: notesAdmin,
      },
    }).then(() => {
      message.success('Berhasil Menyimpan Notes');
      fetchSubmission();
    }).catch(() => {
      message.error('Gagal Menyimpan Submisi');
    }).finally(() => {
      setLoading(false);
      setEditIkiModal(false);
    });
  };

  const onSubmitGDrive = () => {
    const validPrefix = 'https://drive.google.com/';
    if (linkDrive.indexOf(validPrefix) === -1) {
      setErrorDrive(true);
    } else {
      setErrorDrive(false);
      setLoading(true);
      DataSubmissionService.putLinkGDrive({
        id: pinjaman.pinjaman_id,
        data: {
          url: linkDrive ?? submissionBorrower?.link_submisi,
          transaksi_id: pinjaman.transaksi_id,
        },
      }).then(() => {
        message.success('Berhasil Menyimpan Link');
        fetchSubmission();
        fetchProgress();
        setSaveDisable(false);
      }).catch(() => {
        message.error('Gagal Menyimpan Link');
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleUpload = {
    name: 'file',
    accept: '.doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png',
    multiple: false,
    maxCount: 1,
    beforeUpload: () => {
      return false;
    },
    onChange: (info) => {
      const fileList = [...info.fileList];
      const formData = new FormData();

      formData.append('executive_summary', info.file);

      setState((prevState) => ({
        ...prevState,
        form: {
          ...prevState.form,
          fileList,
        },
      }));
      setLoading(true);
      DataSubmissionService.putExecutiveSummarySubmissionAdmin({
        id: pinjaman.pinjaman_id,
        data: formData,
      }).then(() => {
        message.success('Berhasil Upload');
        fetchExecutiveFile();
      })
        .catch(() => {
          message.error('Gagal Upload');
        })
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
    showUploadList: false,
  };

  const onApprove = (status) => {
    setLoading(true);
    if (status === 2) {
      DataSubmissionService.putNotesRejectionAdmin({
        id: pinjaman.pinjaman_id,
        data: {
          adminNotes: rejectionReason,
        },
      }).then(() => {
        fetchLoanDetail();
      }).catch((err) => message.error(err.pesan));
    }

    DataSubmissionService.postVerifikasiAdmin({
      pinjaman_id: pinjaman.pinjaman_id,
      verifikasi: status,
    })
      .then((res) => {
        message.success(res.pesan);
        fetchSubmission();
      })
      .catch((err) => message.error(err.pesan))
      .finally(() => {
        setShowReject(false);
        setLoading(false);
      });
  };

  const onVerified = (status) => {
    DataConfirmationService.postApproveAnalystDataSubmission({
      data: {
        pinjaman_id: pinjaman.pinjaman_id,
        analyst_acc: status,
      },
    }).then(() => {
      message.success('Berhasil Konfirmasi Data');
      fetchSubmission();
      setVerifikasiDone(true);
    }).catch(() => {
      message.error('Gagal Konfirmasi Data');
    });
  };

  const onDeleteFilePertanyaan = (idFile) => {
    DataSubmissionService.deleteFilePertanyaan(
      {
        data: {
          id_dokumen: idFile,
        },
      },
    ).then(() => {
      message.success('Berhasil Menghapus File');
      fetchExecutiveFile();
    }).catch(() => message.error('Gagal Hapus File'));
  };

  const onConfirmData = () => {
    router.push(`/pengajuan/${pinjaman.pinjaman_id}/3`);
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
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card>
            <Title level={3}>Link Google Drive</Title>
            <Input.Group compact className='mb-2'>
              <Input
                style={{ width: '80%' }}
                placeholder='https://drive.google.com/your_link*'
                onChange={(e) => setLinkDrive(e.target.value)}
                defaultValue={submissionBorrower?.link_submisi ?? null}
              />
              <Button disabled={verifikasiDone || pinjaman?.status === 2 || pinjaman?.status === 2} type='primary' onClick={onSubmitGDrive}>Submit</Button>
            </Input.Group>
            <Text italic><a style={{ color: 'blue' }} href={submissionBorrower?.link_submisi ?? null} target='_blank' rel='noopener noreferrer'>{submissionBorrower?.link_submisi ?? null}</a></Text>
            {errorDrive ? <Paragraph className='mt-2' style={{ color: 'red' }}>URL harus meliputi https://drive.google.com/</Paragraph> : <Paragraph className='text-red-50 mt-2' color='#FC100D'>*Link untuk Koleksi Data</Paragraph>}
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Text style={{ color: 'red', fontStyle: 'italic' }}>Untuk informasi detail, mohon mengacu pada tab proses pengajuan.</Text>
            <Title style={{ marginTop: '10px' }} level={3}>Additional Information</Title>
            <Row>
              <Col style={{ display: user?.data?.userRole === 2 && 'none' }} span={8}>Input Pertama</Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>{user?.data?.userRole === 0 ? 'Expected Verification' : 'Due Date Verification'}</Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>{user?.data?.userRole === 0 ? 'Expected Signing' : 'Actual Date Verification'}</Col>
            </Row>
            <Row>
              <Col style={{ display: user?.data?.userRole === 2 && 'none' }} span={8}>
                <Paragraph strong>{submissionBorrower?.waktu_submisi ? dayjs(submissionBorrower?.waktu_submisi).format('MMM DD, YYYY') : '-'}</Paragraph>
              </Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>
                {
                  user?.data?.userRole === 2
                    ? <Paragraph strong>{submissionBorrower?.tanggal_verifikasi_submisi ? dateSubtractWeekDayOnly(submissionBorrower?.tanggal_verifikasi_submisi, 2) : '-'}</Paragraph>
                    : <Paragraph strong>{submissionBorrower?.waktu_submisi ? dateSubtractWeekDayOnly(submissionBorrower?.waktu_submisi, 2) : '-'}</Paragraph>
                }
              </Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>
                {
                  user?.data?.userRole === 2
                    ? <Paragraph strong>{(user?.type === 'borrower' && submissionBorrower?.expected_signin) ? submissionBorrower?.link_submisi === null ? '-' : dayjs(submissionBorrower?.expected_signin).format('MMM DD YYYY') : (user?.type === 'admin' && submissionBorrower?.tanggal_konfirmasi) ? dayjs(submissionBorrower?.tanggal_konfirmasi).format('MMM DD YYYY') : '-'}</Paragraph>
                    : <Paragraph strong>{(user?.type === 'borrower' && submissionBorrower?.expected_signin) ? submissionBorrower?.link_submisi === null ? '-' : dayjs(submissionBorrower?.expected_signin).format('MMM DD YYYY') : (user?.type === 'admin' && submissionBorrower?.tanggal_verifikasi_submisi) ? dayjs(submissionBorrower?.tanggal_verifikasi_submisi).format('MMM DD YYYY') : '-'}</Paragraph>
                }
              </Col>
            </Row>
            <Row>
              <Col style={{ display: user?.data?.userRole === 2 && 'none' }} span={8}> </Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>
                <Paragraph>{submissionBorrower?.waktu_submisi ? null : null}</Paragraph>
              </Col>
              <Col span={user?.data?.userRole === 2 ? 12 : 8}>
                {/* <Paragraph>{(user?.type === 'borrower' && submissionBorrower?.expected_signin) ? `*${dayjs(submissionBorrower?.expected_signin).diff(dayjs(submissionBorrower?.waktu_submisi), 'day')} days after document completed` : (user?.data?.userRole === 1 && submissionBorrower?.tanggal_verifikasi_submisi) ? `*${dayjs(submissionBorrower?.tanggal_verifikasi_submisi).diff(dayjs(submissionBorrower?.waktu_submisi), 'day')} days after document completed` : (user?.data?.userRole === 9 && submissionBorrower?.tanggal_verifikasi_submisi) ? `*${dayjs(submissionBorrower?.tanggal_verifikasi_submisi).diff(dayjs(submissionBorrower?.waktu_submisi), 'day')} days after document completed` : ''}</Paragraph> */}
                <Paragraph style={{ display: user?.type !== 'borrower' && 'none' }}>*13 Hari kerja setelah dokumen lengkap</Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Divider />

      <Card loading={loading}>
        <Row gutter={ROW_GUTTER}>
          <Col span={16}>
            <Title level={4}>Data Submission</Title>
          </Col>
          <Col span={4}>
            <Title level={4}>Borrower Submission Check</Title>
          </Col>
          <Col className='text-center' span={4}>
            <Title level={4}>Admin Verification</Title>
          </Col>
        </Row>
        {submissionBorrower !== null ? (
          <div>
            <Row gutter={ROW_GUTTER}>
              <Col span={16}><Text strong>Pilih Semua</Text></Col>
              <Col span={4}>
                <Checkbox
                  disabled={user?.data.userRole === 2 || verifikasiDone || pinjaman?.status === 2}
                  onChange={(e) => handleChange(e, 'all', 0)}
                >
                  Pilih Semua
                </Checkbox>
              </Col>
              <Col span={4}>
                <Radio.Group
                  onChange={(e) => handleChange(e, 'all', 1)}
                  disabled={user?.type === 'borrower' || user?.data.userRole === 2 || verifikasiDone || pinjaman?.status === 2}
                >
                  <Radio value={true}>Semua</Radio>
                  <Radio value={false}>Semua</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <hr />
            {submissionBorrower?.data_submisi?.map((item, key) => (
              <Row gutter={ROW_GUTTER} key={key}>
                <Col span={16}>
                  <Text>{item.kategori}</Text>
                </Col>
                <Col span={4}>
                  <Checkbox
                    key={Math.random()}
                    defaultChecked={item.borrower_acc}
                    disabled={user?.data.userRole === 2 || verifikasiDone || pinjaman?.status === 2}
                    onChange={(e) => handleChange(e, key, 0)}
                  />
                </Col>
                <Col span={4}>
                  <Radio.Group
                    key={Math.random()}
                    onChange={(e) => handleChange(e, key, 1)}
                    defaultValue={item.admin_acc}
                    disabled={item.id === '-' || user?.type === 'borrower' || user?.data.userRole === 2 || verifikasiDone || pinjaman?.status === 2}
                  >
                    <Radio value={true}>Benar</Radio>
                    <Radio value={false}>Salah</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            ))}
          </div>
        ) : (
          <div>
            <Row gutter={ROW_GUTTER}>
              <Col span={16}><Text strong>Pilih Semua</Text></Col>
              <Col className='text-center' span={4}>
                <Checkbox
                  disabled
                  onChange={(e) => handleChange(e, 'all')}
                >
                  Pilih Semua
                </Checkbox>
              </Col>
              <Col className='text-center' span={4}>
                {/* <Switch disabled onChange={(e) => handleChange(e, 'all')} /> */}
                <Radio.Group
                  onChange={(e) => handleChange(e, 'all')}
                  disabled={user?.type === 'borrower' || verifikasiDone || pinjaman?.status === 2}
                >
                  <Radio value={true}>Semua</Radio>
                  <Radio value={false}>Semua</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <hr />
            {kategori.map((item, key) => (
              <Row gutter={ROW_GUTTER} key={key}>
                <Col span={16}>
                  <Text>{item.kategori}</Text>
                </Col>
                <Col className='text-center' span={4}>
                  <Checkbox
                    disabled={user?.type === 'admin' || kategori.length > 0 || verifikasiDone || pinjaman?.status === 2}
                    onChange={(e) => handleChange(e, key)}
                  />
                </Col>
                <Col className='text-center' span={4}>
                  <Radio.Group
                    key={Math.random()}
                    onChange={(e) => handleChange(e, key)}
                    defaultValue={item.admin_acc}
                    disabled={item.id === '-' || user?.type === 'borrower' || kategori.length > 0 || verifikasiDone || pinjaman?.status === 2}
                  >
                    <Radio value={true}>Benar</Radio>
                    <Radio value={false}>Salah</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </Card>
      {(user?.data.userRole !== 2) && (
        <Row className='my-4'>
          <Col span={20}> </Col>
          <Col span={4}>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              block
              style={{ borderRadius: 6 }}
              disabled={saveDisable || verifikasiDone || pinjaman?.status === 2}
              onClick={() => (user?.type === 'borrower' ? onSaveSubmission() : onSaveSubmissionAdminAcc())}
            >
              Save
            </Button>
          </Col>
        </Row>
      )}
      {user?.type === 'borrower' ? (
        <Card className='mt-4'>
          <Row gutter={[12, 12]}>
            <Col span={10}>
              <Title level={4}>Catatan IKIMODAL</Title>
            </Col>
            <Col span={24}>
              {/* <TextArea
                rows={4}
                disabled
                defaultValue={submissionBorrower?.catatan_submisi?.catatan_ikimodal != null ? submissionBorrower?.catatan_submisi?.catatan_ikimodal : null}
              /> */}
              <Text>
                {submissionBorrower?.catatan_submisi?.catatan_ikimodal ? submissionBorrower?.catatan_submisi?.catatan_ikimodal.split('\n').map((item, key) => (
                  <Text key={key}>{item}
                    <br />
                  </Text>
                )) : '-'}
              </Text>
            </Col>
            <Divider />
            <Col span={10}>
              <Title level={4}>Catatan Borrower</Title>
            </Col>
            <Col span={24}>
              {(edit) ? (
                <TextArea
                  rows={8}
                  onChange={(e) => onChangeBorrowerNotes(e.currentTarget.value)}
                  placeholder='Take Your Notes Here...'
                  defaultValue={submissionBorrower?.catatan_submisi?.catatan_borrower != null ? submissionBorrower?.catatan_submisi?.catatan_borrower : null}
                />
              ) : (
                <Text>
                  {submissionBorrower?.catatan_submisi?.catatan_borrower ? submissionBorrower?.catatan_submisi?.catatan_borrower.split('\n').map((item, key) => (
                    <Text key={key}>{item}
                      <br />
                    </Text>
                  )) : '-'}
                </Text>
              )}
            </Col>
            <Col span={16}> </Col>
            <Col span={4}>
              <Button
                type='secondary'
                size='large'
                block
                style={{ borderRadius: 6 }}
                disabled={edit === true || saveDisable || !submissionBorrower?.catatan_submisi?.catatan_ikimodal || verifikasiDone || pinjaman?.status === 2}
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
            </Col>
            <Col span={4}>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                block
                disabled={saveDisable || !submissionBorrower?.catatan_submisi?.catatan_ikimodal || verifikasiDone || pinjaman?.status === 2}
                style={{ borderRadius: 6 }}
                onClick={onSubmitNotesBorrower}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (user?.data?.userRole === 1 || user?.data?.userRole === 9) ? (
        <>
          <Card>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>
                  Catatan IKIMODAL
                </Text>
              </Col>
              <Col span={24}>
                {editIkiModal ? (
                  <TextArea
                    rows={8}
                    onChange={(e) => onChangeAdminNotes(e.currentTarget.value)}
                    defaultValue={submissionBorrower?.catatan_submisi?.catatan_ikimodal}
                    placeholder='Take Your Notes Here...'
                  />
                ) : (
                  <Text>
                    {submissionBorrower?.catatan_submisi?.catatan_ikimodal ? submissionBorrower?.catatan_submisi?.catatan_ikimodal.split('\n').map((item, key) => (
                      <Text key={key}>{item}
                        <br />
                      </Text>
                    )) : '-'}
                  </Text>
                )}
              </Col>
              <Col span={16}> </Col>
              <Col span={4}>
                <Button
                  type='secondary'
                  size='large'
                  block
                  style={{ borderRadius: 6 }}
                  disabled={editIkiModal || saveDisable || verifikasiDone || pinjaman?.status === 2}
                  onClick={() => setEditIkiModal(true)}
                >
                  Edit
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  type='primary'
                  size='large'
                  htmlType='submit'
                  block
                  disabled={saveDisable || verifikasiDone || pinjaman?.status === 2}
                  style={{ borderRadius: 6 }}
                  onClick={onSubmitNotesAdmin}
                >
                  Tambah
                </Button>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[12, 12]} className='mt-4'>
              <Col span={24}>
                <Text strong>
                  Catatan Borrower
                </Text>
              </Col>
              <Col span={24}>
                <Text>
                  {submissionBorrower?.catatan_submisi?.catatan_borrower ? submissionBorrower?.catatan_submisi?.catatan_borrower.split('\n').map((item, key) => (
                    <Text key={key}>{item}
                      <br />
                    </Text>
                  )) : '-'}
                </Text>
              </Col>
            </Row>
          </Card>
          <Card>
            <Text strong>
              Unggah Rangkuman
            </Text>
            <Dragger {...handleUpload} disabled={verifikasiDone || pinjaman?.status === 2} className='mb-4 mt-3'>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>Upload file disini</p>
              <p className='ant-upload-hint'>
                Hanya menerima file dalam bentuk .doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png
              </p>
            </Dragger>
            {executiveFile?.length > 0 && (
              <List
                className='mt-2 mb-4'
                bordered
                itemLayout='horizontal'
                dataSource={executiveFile}
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
                    </Skeleton>
                  </List.Item>
                )}
              />
            )}
            <Text strong className='mt-3'>
              Action
            </Text>
            <Row gutter={[24, 24]} className='mt-3'>
              <Col span={4}>
                <Button
                  type='danger'
                  size='large'
                  block
                  disabled={saveDisable || verifikasiDone || pinjaman?.status === 2}
                  style={{ borderRadius: 6 }}
                  onClick={() => setShowReject(true)}
                >
                  Tolak
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  type='primary'
                  size='large'
                  block
                  disabled={saveDisable || verifikasiDone || pinjaman?.status === 2}
                  style={{ borderRadius: 6 }}
                  onClick={() => setShowVerification(true)}
                >
                  Verifikasi
                </Button>
              </Col>
            </Row>
          </Card>
          <Modal title='Reject Pengajuan' open={showReject} onCancel={() => setShowReject(false)} onOk={() => onApprove(2)} okText='Reject' cancelText='Batal'>
            <p>Apakah anda yakin akan menolak pengajuan?</p>
            <div className='flex-row'>
              <TextArea rows={6} placeholder='Isi Rejection Note' onChange={(e) => setRejectionReason(e.target.value)} />
            </div>
          </Modal>
          <Modal title='Verifikasi Pengajuan' open={showVerification} onCancel={() => setShowVerification(false)} onOk={() => { setShowVerification(false); onApprove(1); }} okText='Ya' cancelText='Batal'>
            <p>Apakah anda yakin akan menerima pengajuan?</p>
          </Modal>
        </>
      ) : (user?.data.userRole === 2) ? (
        <Row gutter={[24, 24]} className='my-3'>
          <Col span={16}> </Col>
          <Col span={4}>
            <Button
              type='primary'
              size='large'
              block
              style={{ borderRadius: 6 }}
              onClick={() => setVerifikasiAnalisModal(true)}
            >
              Verified
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type='secondary'
              size='large'
              block
              style={{ borderRadius: 6 }}
              onClick={() => onConfirmData()}
            >
              Konfirmasi Data
            </Button>
          </Col>
        </Row>
      ) : (
        <Empty />
      )}
      {
        submissionBorrower?.status_verifikasi !== 1 && submissionBorrower?.catatan_submisi?.catatan_tambahan
          ? (
            <Card>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Text strong>
                    Catatan Penolakan
                  </Text>
                </Col>
                <Col span={24}>
                  <Text>
                    {
                      submissionBorrower?.catatan_submisi?.catatan_tambahan.split('\n').map((item, key) => (
                        <Text key={key}>{item}
                          <br />
                        </Text>
                      ))
                    }
                  </Text>
                </Col>
              </Row>
            </Card>
          ) : (
            <div />
          )
      }
      <Modal
        closable={false}
        open={peringatanPengajuan}
        onOk={() => {
          setPeringatanPengajuan(false);
        }}
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
        <Title style={{ color: 'red' }} className='text-center mt-4' level={3}>Segera Lengkapi Data Pengajuan Anda</Title>
        <Title className='text-center' level={5}>Kelengkapan dokumen Anda mempengaruhi estimasi tanggal pencairan.</Title>
      </Modal>
      <Modal
        title='Verifikasi Pengajuan Data'
        open={verifikasiAnalisModal}
        onCancel={() => setVerifikasiAnalisModal(false)}
        onOk={() => {
          setVerifikasiAnalisModal(false);
          onVerified(true);
        }}
        okText='Ya'
        cancelText='Batal'
      >
        <p>Yakin Verifikasi Pengajuan Data?</p>
      </Modal>
    </>
  );
}

Pengajuan2.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={2}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan2;
