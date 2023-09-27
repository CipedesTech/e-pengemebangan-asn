/* eslint-disable no-nested-ternary */
import { InboxOutlined, MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Card, Row, Col, Typography, message, Divider, Form, Input, Upload, Button, Empty, Select, Switch, List, Skeleton, Modal, Space, Image, Progress } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import AppLayout from 'layouts/app-layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DataSubmissionService from 'services/DataSubmissionService';
import FinalizationService from 'services/FinalizationService';
import LoanListService from 'services/LoanListService';
import { ConvertMime, toBase64 } from 'utils/Utils';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;
const { TextArea } = Input;

function Tambah() {
  const router = useRouter();
  const { loanId } = router.query;
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [formLender] = Form.useForm();
  const [akadForm] = Form.useForm();
  const [akadFormDua] = Form.useForm();

  const [akadKreditData, setAkadKreditData] = useState(null);
  const [akadKreditModal, setAkadKreditModal] = useState(false);

  const [lenderApprovalData, setlenderApprovalData] = useState(null);
  const [lenderApprovalModal, setlenderApprovalModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [finalisasi, setFinalisasi] = useState([]);
  const [dokumen, setDokumen] = useState({});
  const [signingNotesModal, setSigningNotesModal] = useState(false);
  const [processComiteeCreditModal, setProcessComiteeCreditModal] = useState(false);
  const [tolakProcessComiteeCreditModal, setTolakProcessComiteeCreditModal] = useState(false);
  const [signingNotes, setSigningNotes] = useState(null);
  const [pinjaman, setPinjaman] = useState({});
  const [pertanyaanLender, setPertanyaanLender] = useState([]);
  const [pertanyaanAkad, setPertanyaanAkad] = useState([]);
  const [lenderField, setLenderField] = useState([]);
  const [akadField, setAkadField] = useState([]);
  const [progress, setProgress] = useState(null);

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
    DataSubmissionService.getProgress(pinjaman?.pinjaman_id)
      .then((res) => setProgress(res.progress))
      .catch((err) => err.pesan);
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) fetchProgress();
  }, [pinjaman]);

  const fetchDokumenAdmin = () => {
    setLoading(true);
    FinalizationService.getDokumenAdmin(pinjaman?.pinjaman_id)
      .then((res) => {
        setDokumen(res);
      }).catch((err) => {
        message.error(err?.message);
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) {
      if (user?.data.userRole === 1 || user?.data.userRole === 9) fetchDokumenAdmin();
    }
  }, [pinjaman]);

  const fetchFinalisasiBorrower = () => {
    setLoading(true);
    FinalizationService.getFinalisasiBorrower(pinjaman?.pinjaman_id)
      .then((res) => {
        setFinalisasi(res.data);
        if (res.data[0].akad_credit_status === null && res.data[0].lender_approval_status === null) {
          setStatus(res.data[0].credit_commitee_status);
          // eslint-disable-next-line no-dupe-else-if
        } else if (res.data[0].credit_commitee_status !== null && res.data[0].akad_credit_status === null && res.data[0].lender_approval_status !== null) {
          setStatus(res.data[0].lender_approval_status);
        } else if (res.data[0].credit_commitee_status !== null && res.data[0].lender_approval_status !== null && res.data[0].akad_credit_status !== null) {
          setStatus(res.data[0].akad_credit_status);
        }
      }).catch(() => {
        message.error('Gagal Mengambil Data Finalisasi');
      }).finally(() => setLoading(false));
  };

  const fetchFinalisasiAdmin = () => {
    setLoading(true);
    FinalizationService.getFinalisasiAdmin(pinjaman?.pinjaman_id)
      .then((res) => {
        setFinalisasi(res.data);
        if (res.data[0].akad_credit_status === null && res.data[0].lender_approval_status === null) {
          setStatus(res.data[0].credit_commitee_status);
          // eslint-disable-next-line no-dupe-else-if
        } else if (res.data[0].credit_commitee_status !== null && res.data[0].akad_credit_status === null && res.data[0].lender_approval_status !== null) {
          setStatus(res.data[0].lender_approval_status);
        } else if (res.data[0].credit_commitee_status !== null && res.data[0].lender_approval_status !== null && res.data[0].akad_credit_status !== null) {
          setStatus(res.data[0].akad_credit_status);
        } else {
          message.info('finalisasi belum bisa dilakukan');
        }
      }).catch(() => {
        message.error('Gagal Mengambil Data Finalisasi');
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) {
      if (user?.data?.userRole === 0) {
        fetchFinalisasiBorrower();
      } else {
        fetchFinalisasiAdmin();
      }
    }
  }, [pinjaman]);

  const fetchPertanyaanLenderBorrower = () => {
    FinalizationService.getPertanyaanLenderApproval(pinjaman?.pinjaman_id)
      .then((res) => {
        setPertanyaanLender(res.data);
      }).catch(() => {
        message.error('Gagal Mengambil Pertanyaan Lender Approval');
      });
  };

  useEffect(() => {
    if (status > 2) {
      fetchPertanyaanLenderBorrower();
    }
  }, [status]);

  const fetchPertanyaanAkadBorrower = () => {
    FinalizationService.getPertanyaanAkadCredit(pinjaman?.pinjaman_id)
      .then((res) => {
        setPertanyaanAkad(res.data);
      }).catch(() => {
        message.error('Gagal Mengambil Pertanyaan Akad');
      });
  };

  useEffect(() => {
    if (status >= 4) {
      fetchPertanyaanAkadBorrower();
    }
  }, [status]);

  const handleUpload = {
    beforeUpload: () => {
      return false;
    },
    name: 'file',
    accept: '.doc, .docx, .pptx, .xlsx, .pdf, .jpg, .png',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
  };

  const onUpload = async (info, pertanyaanId, jenisUpload) => {
    const formData = new FormData();

    if (user?.data.userRole === 0) {
      if (jenisUpload === 'lender_approval') {
        formData.append('lender_approval_file', info.file);
        formData.append('pinjaman_id', pinjaman?.pinjaman_id);

        FinalizationService.postUploadFileLenderApproval({
          id: pertanyaanId,
          data: formData,
        }).then(() => {
          fetchFinalisasiBorrower();
          fetchPertanyaanLenderBorrower();
          message.success('Berhasil Upload');
        }).catch(() => {
          message.error('Gagal Upload');
        });
      } else if (jenisUpload === 'akad_credit') {
        formData.append('akad_credit_file', info.file);
        formData.append('pinjaman_id', pinjaman?.pinjaman_id);

        let base64filedata = await toBase64(info.fileList[0].originFileObj);
        base64filedata = base64filedata.split(';');
        FinalizationService.postUploadFileAkadKreditBorrowerOSS({
          id: pertanyaanId,
          data: {
            bucket: 'ikimodal-dev',
            filedata: `data:${ConvertMime(info?.file?.type)};${base64filedata[1]}`,
            pertanyaan_id: pertanyaanId,
          },
        }).then(() => {
          fetchFinalisasiBorrower();
          fetchPertanyaanAkadBorrower();
          message.success('Berhasil Upload');
        }).catch(() => {
          message.error('Gagal Upload');
        });
      }
    }
  };

  const onSubmitLenderApprovalBorrower = (values) => {
    const newData = [];

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

    setlenderApprovalData(newData);
    setlenderApprovalModal(true);
  };

  const onSubmitLender = () => {
    setLoading(true);
    if (user?.data?.userRole === 0) {
      FinalizationService.putJawabanLenderApproval({
        id: finalisasi[0]?.id,
        data: {
          pinjaman_id: pinjaman?.pinjaman_id,
          data: [...new Set(lenderApprovalData)],
        },
      }).then(() => {
        message.success('Berhasil Menjawab');
        fetchFinalisasiBorrower();
      }).catch(() => message.error('Gagal Menjawab'))
        .finally(() => setLoading(false));
    } else {
      FinalizationService.postPertanyaanLenderApproval({
        id: finalisasi[0]?.id,
        data: {
          data: [...new Set(lenderApprovalData)],
        },
      }).then(() => {
        message.success('Berhasil Membuat Pertanyaan');
        fetchFinalisasiAdmin();
        fetchPertanyaanLenderBorrower();
      }).catch(() => message.error('Gagal Membuat Pertanyaan'))
        .finally(() => setLoading(false));
    }
  };

  const onSubmitAkadKreditBorrower = (values) => {
    const newData = [];

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

    setAkadKreditData(newData);
    setAkadKreditModal(true);
  };

  const onSubmitAkad = () => {
    setLoading(true);
    if (user?.type === 'borrower') {
      FinalizationService.putJawabanAkadKredit({
        id: finalisasi[0]?.id,
        data: {
          pinjaman_id: pinjaman?.pinjaman_id,
          data: [...new Set(akadKreditData)],
        },
      }).then(() => {
        message.success('Berhasil Melakukan Akad Kredit');
        fetchFinalisasiBorrower();
      }).catch(() => message.error('Gagal Melakukan Akad Kredit'))
        .finally(() => setLoading(false));
    } else {
      FinalizationService.postPertanyaanAkadKredit({
        id: finalisasi[0]?.id,
        data: {
          data: [...new Set(akadKreditData)],
        },
      }).then(() => {
        message.success('Berhasil Membuat Pertanyaan');
        fetchPertanyaanAkadBorrower();
        fetchFinalisasiAdmin();
      }).catch(() => message.error('Gagal Membuat Pertanyaan'))
        .finally(() => setLoading(false));
    }
  };

  const onUploadCreditCommiteeProcess = async (info) => {
    const formData = new FormData();

    formData.append('credit_commitee_file', info.file);
    formData.append('pinjaman_id', pinjaman?.pinjaman_id);

    setLoading(true);
    await FinalizationService.postUploadFileCommitee({
      id: finalisasi[0]?.id,
      data: formData,
    }).then(() => {
      message.success('Berhasil Upload File');
      fetchDokumenAdmin();
      fetchFinalisasiAdmin();
    }).catch(() => message.error('Gagal Upload File'))
      .finally(() => setLoading(false));
  };

  const onApproveDocumentCreditComiteeProcess = (statusApproval) => {
    FinalizationService.putApprovalDocumentComitee({
      data: {
        pinjaman_id: pinjaman?.pinjaman_id,
        approval: statusApproval,
      },
    }).then(() => {
      // message.success('Berhasil Approval Commitee Credit');
      fetchFinalisasiAdmin();
    }).catch((res) => {
      message.error(res.data?.message);
    });

    if (statusApproval === false) {
      DataSubmissionService.putNotesRejectionAdmin({
        id: pinjaman?.pinjaman_id,
        data: {
          adminNotes: '-',
        },
      }).then(() => {
        fetchLoanDetail();
      }).catch((err) => message.error(err.pesan));
    }
  };

  const onUploadLenderApproval = (info) => {
    const formData = new FormData();

    formData.append('factsheet_file', info.file);

    FinalizationService.postUploadFactSheetLender({
      id: finalisasi[0]?.id,
      data: formData,
    }).then(() => {
      fetchDokumenAdmin();
      fetchPertanyaanLenderBorrower();
    }).catch(() => message.error('Gagal Upload'));
  };

  const onAddLenderField = () => {
    setLenderField((prevState) => ([
      ...prevState,
      {
        id: uuidv4,
        pertanyaan: null,
        unggah_file: false,
      },
    ]));
  };

  const onAddAkadField = () => {
    setAkadField((prevState) => ([
      ...prevState,
      {
        id: uuidv4,
        pertanyaan: null,
        unggah_file: false,
      },
    ]));
  };

  const onChangeQuestion = (rowId, field, value) => {
    const newData = [...lenderField];
    const index = newData.findIndex((item) => rowId === item.id);

    newData[index][field] = value;

    setLenderField(newData);
  };

  const onChangeQuestionAkad = (rowId, field, value) => {
    const newData = [...akadField];
    const index = newData.findIndex((item) => rowId === item.id);

    newData[index][field] = value;

    setAkadField(newData);
  };

  const onRemoveLenderField = () => {
    const newQuestion = lenderField.filter((element, index) => index < lenderField.length - 1);

    setLenderField([...newQuestion]);
  };

  const onRemoveAkadField = () => {
    const newQuestion = akadField.filter((element, index) => index < akadField.length - 1);

    setAkadField([...newQuestion]);
  };

  const onApproveDokumenLender = (id, statusDokumen) => {
    FinalizationService.putApproveDokumenLender({
      data: {
        dokumen_id: id,
        approval: statusDokumen,
      },
    })
      .then(() => {
        if (statusDokumen === false) {
          message.error('Dokumen tidak sesuai');
        } else {
          message.success('Berhasil Upload Dokumen');
        }
        fetchPertanyaanLenderBorrower();
      })
      .catch(() => message.error('Gagal Upload Dokumen'));
  };

  const onApproveDokumenAkad = (id, statusDokumen) => {
    FinalizationService.putApproveDokumenAkad({
      data: {
        dokumen_id: id,
        approval: statusDokumen,
      },
    })
      .then(() => {
        if (statusDokumen === false) {
          message.error('Dokumen tidak sesuai');
        } else {
          message.success('Berhasil Upload Dokumen');
        }
        fetchPertanyaanAkadBorrower();
      })
      .catch(() => message.error('Gagal Upload Dokumen'));
  };

  const onApproveFinalization = () => {
    FinalizationService.putSigningNotes({
      id: finalisasi[0]?.id,
      data: {
        notes: signingNotes,
      },
    }).then(() => {
      message.success('Berhasil Menambahkan Signing Notes');
      setSigningNotesModal(false);
      // fetch lagi untuk ambil data signing notes
      fetchFinalisasiAdmin();
    }).catch(() => {
      message.error('Gagal Menambahkan Signing Notes');
    });
  };

  const onChangeStatusLender = (info) => {
    if (info !== 0) {
      FinalizationService.putStatusAdmin({
        id: pinjaman?.pinjaman_id,
        data: {
          lender_status: info,
        },
      }).then(() => {
        message.success('Berhasil Ubah Status');
        setStatus(info);
        fetchFinalisasiAdmin();
      }).catch(() => {
        message.error('Gagal Ubah Status');
      });
    } else {
      //
    }
  };

  const onChangeStatusAkad = (info) => {
    if (info !== 0) {
      FinalizationService.putStatusAdmin({
        id: pinjaman?.pinjaman_id,
        data: {
          akad_status: info,
        },
      }).then(() => {
        message.success('Berhasil Ubah Status');
        setStatus(info);
        fetchFinalisasiAdmin();
      }).catch(() => {
        message.error('Gagal Ubah Status');
      });
    } else {
      // res
    }
  };

  const onDeleteFilePertanyaanCommitee = (idFile) => {
    FinalizationService.deleteFilePertanyaanCommitee({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      message.success('Berhasil Menghapus File');
      fetchDokumenAdmin();
      fetchFinalisasiAdmin();
    }).catch(() => message.error('Gagal Hapus File'));
  };

  const onDeleteFilePertanyaanLenderFactsheet = (idFile) => {
    FinalizationService.deleteFilePertanyaanLenderFactsheet({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      fetchFinalisasiAdmin();
      fetchDokumenAdmin();
      fetchPertanyaanLenderBorrower();
      message.success('Berhasil Menghapus File');
    }).catch(() => message.error('Gagal Hapus File'));
  };

  const onDeleteFilePertanyaanLenderFile = (idFile) => {
    FinalizationService.deleteFilePertanyaanLenderFile({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      fetchFinalisasiAdmin();
      fetchPertanyaanLenderBorrower();
      fetchDokumenAdmin();
      message.success('Berhasil Menghapus File');
    }).catch(() => message.error('Gagal Hapus File'));
  };

  const onDeleteFilePertanyaanAkad = (idFile) => {
    FinalizationService.deleteFilePertanyaanAkad({
      data: {
        id_dokumen: idFile,
      },
    }).then(() => {
      fetchPertanyaanAkadBorrower();
      message.success('Berhasil Menghapus File');
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
      <Card title='Proses Komite Kredit' loading={loading}>
        {(user?.data.userRole === 0 || user?.data.userRole === 2) ? (
          <>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Status</Text>
              </Col>
              <Col span={24}>
                <Text>{status < 1 ? 'Finalisasi Belum Dapat Dilakukan' : status === 1 ? 'Aplikasi pinjaman anda sedang ditinjau komite kredit' : status >= 2 ? 'Pengajuan pinjaman anda disetujui komite kredit' : '-'}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Catatan Dari IKIMODAL</Text>
              </Col>
              <Col span={24}>
                <Text>{finalisasi[0]?.notes || '-'}</Text>
              </Col>
            </Row>
          </>
        ) : (user?.data.userRole === 1 || user?.data.userRole === 9) ? (
          <>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Upload Dokumen</Text>
              </Col>
              <Col span={12}>
                <Dragger
                  {...handleUpload}
                  onChange={(info) => {
                    onUploadCreditCommiteeProcess(info);
                  }}
                  disabled={status === undefined || status >= 3 || pinjaman?.status === 2}
                  className='mt-2'
                  style={{ width: '100%' }}
                >
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                  <p className='ant-upload-hint'>
                    Upload Your file here
                  </p>
                </Dragger>
              </Col>
              <Col span={12}>
                <List
                  bordered
                  className='mt-2'
                  itemLayout='horizontal'
                  dataSource={dokumen?.list_commitee !== undefined ? dokumen?.list_commitee[0]?.assets_credit_commitees : []}
                  renderItem={(child, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <Button type='link' onClick={() => onDeleteFilePertanyaanCommitee(child.id)} style={{ color: 'red' }} key={index}>Hapus</Button>,
                        <Button type='link' key={index}><a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                      ]}
                    >
                      <Skeleton title={false} loading={loading} active={loading}>
                        <List.Item.Meta
                          title={<a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>{child.file_name}</a>}
                        />
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Upload Status</Text>
              </Col>
              <Col span={24}>
                <Text>{status < 1 ? 'Finalisasi Belum Dapat Dilakukan' : status === 1 ? 'Aplikasi pinjaman anda sedang ditinjau komite kredit' : status > 1 ? 'Pengajuan pinjaman anda disetujui komite kredit' : '-'}</Text>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Action</Text>
              </Col>
              <Col span={4}>
                <Button
                  className='mt-3'
                  block
                  type='primary'
                  onClick={() => setProcessComiteeCreditModal(true)}
                  disabled={status >= 3 || status === undefined || pinjaman?.status === 2}
                >
                  Terima
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  className='mt-3'
                  block
                  type='danger'
                  onClick={() => setTolakProcessComiteeCreditModal(true)}
                  disabled={status >= 3 || status === undefined || pinjaman?.status === 2}
                >
                  Tolak
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <div />
        )}
      </Card>
      <Card title='Proses Persetujuan Pemberi Pinjaman'>
        {(user?.data.userRole === 0 || user?.data.userRole === 2) ? (
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Text strong>Status</Text>
            </Col>
            <Col span={24}>
              <Text>{status < 3 ? '-' : status === 3 ? 'Mencari Lender' : status >= 4 ? 'Lender Menyetujui' : '-'}</Text>
            </Col>
            <Divider />
            <Col span={24}>
              <Form form={form} name='lender' layout='vertical' autoComplete='off' onFinish={onSubmitLenderApprovalBorrower}>
                {pertanyaanLender.length > 0 ? (
                  <>
                    {pertanyaanLender[0]?.pertanyaan_lenders?.length > 0 ? (
                      <div>
                        {pertanyaanLender[0]?.pertanyaan_lenders.map((child, index) => (
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
                              label={`${index + 1}. ${child?.pertanyaan}`}
                              initialValue={child?.jawaban}
                              className='mt-2'
                            >
                              <Input className='mb-2' placeholder='Isi jawaban disini atau upload file' />
                            </Form.Item>
                            {user?.data.userRole === 0 && (
                              <Upload
                                {...handleUpload}
                                onChange={(e) => onUpload(e, child.id, 'lender_approval')}
                              >
                                <Button style={{ borderRadius: 6 }} icon={<UploadOutlined />}>Upload File</Button>
                              </Upload>
                            )}
                            {child?.assets_lender_approvals?.length >= 1 && (
                              <List
                                bordered
                                className='mt-2'
                                itemLayout='horizontal'
                                dataSource={child.assets_lender_approvals}
                                renderItem={(childs, indexs) => (
                                  <List.Item
                                    actions={[
                                      // <Button type='link' onClick={() => onDeleteFilePertanyaanLenderFile(childs.id)} style={{ color: 'red' }} key={indexs}>Hapus</Button>,
                                      <Button type='link' key={indexs}><a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                                    ]}
                                  >
                                    <Skeleton title={false} loading={loading} active={loading}>
                                      <List.Item.Meta
                                        avatar={<Image preview={false} width={30} src={childs.approval === true ? '/img/green-check-list.png' : childs.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                        title={<a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>{childs.file_name}</a>}
                                      />
                                    </Skeleton>
                                  </List.Item>
                                )}
                              />
                            )}
                          </>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        description={(
                          <span>
                            Belum ada pertanyaan
                          </span>
                        )}
                      />
                    )}
                    {user?.data?.userRole === 0 && (
                      <Form.Item className='mb-0 mt-4'>
                        <Row gutter={[12, 12]}>
                          <Col span={20}> </Col>
                          <Col span={4}>
                            <Button
                              type='primary'
                              size='large'
                              htmlType='submit'
                              block
                              disabled={pertanyaanLender.length === 0 || pinjaman?.status === 2}
                              style={{ borderRadius: 6 }}
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                    )}
                  </>
                ) : (
                  <Empty
                    description={(
                      <span>
                        Belum ada pertanyaan
                      </span>
                    )}
                  />
                )}
              </Form>
            </Col>
          </Row>
        ) : (user?.data.userRole === 1 || user?.data.userRole === 9) ? (
          <>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Upload Dokumen</Text>
              </Col>
              <Col span={12}>
                <Dragger
                  {...handleUpload}
                  disabled={status < 3 || status === undefined || pinjaman?.status === 2}
                  onChange={onUploadLenderApproval}
                  className='mt-2'
                >
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                  <p className='ant-upload-hint'>
                    Upload Your file here
                  </p>
                </Dragger>
              </Col>
              <Col span={12}>
                <List
                  bordered
                  className='mt-2'
                  itemLayout='horizontal'
                  dataSource={pertanyaanLender[0]?.factsheets.length > 0 ? pertanyaanLender[0]?.factsheets : []}
                  renderItem={(child, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <Button type='link' onClick={() => onDeleteFilePertanyaanLenderFactsheet(child.id)} style={{ color: 'red' }} key={index}>Hapus</Button>,
                        <Button type='link' key={index}><a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                      ]}
                    >
                      <Skeleton title={false} loading={loading} active={loading}>
                        <List.Item.Meta
                          title={<a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>{child.file_name}</a>}
                        />
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Text strong>Status</Text>
              </Col>
              <Col span={24}>
                <Select
                  disabled={status < 3 || status === 8 || status === undefined || pinjaman?.status === 2}
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    onChangeStatusLender(e);
                  }}
                  value={status < 3 ? 0 : status > 4 ? 4 : status}
                  options={[
                    {
                      value: 0,
                      label: '-',
                    },
                    {
                      value: 3,
                      label: 'Mencari lender',
                    },
                    {
                      value: 4,
                      label: 'Lender menyetujui',
                    },
                  ]}
                />
              </Col>
              <Divider />
              {pertanyaanLender[0]?.pertanyaan_lenders?.length === 0 ? (
                <>
                  <Col span={24}>
                    <Button
                      type='primary'
                      icon={<PlusOutlined />}
                      disabled={status < 3 || pinjaman?.status === 2}
                      onClick={() => onAddLenderField()}
                      className='mr-2'
                    >
                      Tambah Field
                    </Button>
                    <Button icon={<MinusOutlined />} disabled={lenderField.length < 2 || status < 3 || pinjaman?.status === 2} onClick={onRemoveLenderField}>
                      {t('Kurangi Field')}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Form form={formLender} layout='vertical' autoComplete='off' onFinish={onSubmitLenderApprovalBorrower}>
                      {lenderField?.map((item, key) => (
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
                      <Row>
                        <Col span={20}> </Col>
                        <Col span={4}>
                          {lenderField.length >= 1
                            && (
                              <Form.Item className='mb-0'>
                                <Button type='primary' disabled={status < 3 || pinjaman?.status === 2} block htmlType='submit'>
                                  {t('button:submit')}
                                </Button>
                              </Form.Item>
                            )}
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </>
              ) : (
                <Col span={24}>
                  <Form form={form} layout='vertical' autoComplete='off'>
                    {pertanyaanLender[0]?.pertanyaan_lenders?.map((item, key) => (
                      <div key={key}>
                        <Form.Item
                          name={`pertanyaan_${key + 1}`}
                          label={`${item.pertanyaan}`}
                          className='mt-2'
                          initialValue={item.jawaban}
                          rules={[
                            { required: true, message: t('validation:required', { field: `Pertanyaan ke-${key + 1}` }) },
                          ]}
                        >
                          <Input
                            placeholder={t('placeholder:enter', { field: `Jawaban ke-${key + 1}` })}
                            disabled
                            onBlur={(e) => {
                              const { value } = e.target;
                              onChangeQuestion(item.id, 'pertanyaan', value);
                            }}
                          />
                        </Form.Item>
                        {item.assets_lender_approvals.length >= 1 && (
                          <List
                            bordered
                            itemLayout='horizontal'
                            dataSource={item.assets_lender_approvals}
                            renderItem={(child, index) => (
                              <List.Item
                                actions={[
                                  <Button type='link' onClick={() => onDeleteFilePertanyaanLenderFile(child.id)} style={{ color: 'red' }} key={index}>Hapus</Button>,
                                  <Button type='link' key={index}><a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                                  <Button type='link' disabled={child.approval === true ? true : child.approval === false || pinjaman?.status === 2} onClick={() => onApproveDokumenLender(child.id, true)} key={index}>Dokumen Benar</Button>,
                                  <Button type='link' disabled={child.approval === true ? true : child.approval === false || pinjaman?.status === 2} onClick={() => onApproveDokumenLender(child.id, false)} key={index}>Tidak Sesuai</Button>,
                                ]}
                              >
                                <Skeleton title={false} loading={loading} active={loading}>
                                  <List.Item.Meta
                                    avatar={<Image preview={false} width={30} src={child.approval === true ? '/img/green-check-list.png' : child.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                    title={<a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>{child.file_name}</a>}
                                  />
                                </Skeleton>
                              </List.Item>
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </Form>
                </Col>
              )}
            </Row>
          </>
        ) : (
          <div />
        )}
      </Card>
      <Card title='Akad Kredit'>
        {(user?.data.userRole === 0 || user?.data.userRole === 2) ? (
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Text strong>Status</Text>
            </Col>
            <Col span={24}>
              <Text>{status < 5 ? '-' : status === 6 ? 'Akad kredit dalam proses, mohon lengkapi data Anda' : status === 7 ? 'Proses tanda tangan' : status === 8 ? 'Akad Kredit Selesai' : '-'}</Text>
            </Col>
            <Divider />
            <Col span={24}>
              <Form form={akadForm} name='akad' layout='vertical' autoComplete='off' onFinish={onSubmitAkadKreditBorrower}>
                {pertanyaanAkad.length > 0 ? (
                  <>
                    {pertanyaanAkad.map((item, key) => (
                      <div key={key}>
                        {item.pertanyaan_akads?.length > 0 ? (
                          <>
                            {item.pertanyaan_akads.map((child, index) => (
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
                                  label={`${index + 1}. ${item.pertanyaan_akads[index].pertanyaan}`}
                                  initialValue={item.pertanyaan_akads[index].jawaban}
                                  className='mt-2'
                                >
                                  <Input className='mb-2' placeholder='Isi jawaban disini atau upload file' />
                                </Form.Item>
                                {user?.data.userRole === 0 && (
                                  <Upload {...handleUpload} onChange={(e) => onUpload(e, item.pertanyaan_akads[index].id, 'akad_credit')}>
                                    <Button style={{ borderRadius: 6 }} icon={<UploadOutlined />}>Upload File</Button>
                                  </Upload>
                                )}
                                {child?.assets_akad_credits?.length >= 1 && (
                                  <List
                                    bordered
                                    itemLayout='horizontal'
                                    dataSource={child.assets_akad_credits}
                                    renderItem={(childs, indexs) => (
                                      <List.Item
                                        actions={[
                                          // <Button type='link' onClick={() => onDeleteFilePertanyaanAkad(childs.id)} style={{ color: 'red' }} key={indexs}>Hapus</Button>,
                                          <Button type='link' key={indexs}><a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                                        ]}
                                      >
                                        <Skeleton title={false} loading={loading} active={loading}>
                                          <List.Item.Meta
                                            avatar={<Image preview={false} width={30} src={childs.approval === true ? '/img/green-check-list.png' : childs.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                            title={<a href={`${childs.path}`} target='_blank' rel='noopener noreferrer'>{childs.file_name}</a>}
                                          />
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
                    {user?.data.userRole === 0 && (
                      <Form.Item className='mb-0 mt-4'>
                        <Row>
                          <Col span={20}> </Col>
                          <Col span={4}>
                            <Form.Item className='mb-0'>
                              <Button type='primary' block htmlType='submit'>
                                Submit
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    )}
                  </>
                ) : (
                  <Empty
                    description={(
                      <span>
                        Belum ada akad
                      </span>
                    )}
                  />
                )}
              </Form>
            </Col>
          </Row>
        ) : (user?.data.userRole === 1 || user?.data.userRole === 9) ? (
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Text strong>Status</Text>
            </Col>
            <Col span={24}>
              <Select
                disabled={status < 5 || status === undefined || finalisasi[0]?.notes !== null || pinjaman?.status === 2}
                style={{ width: '100%' }}
                onChange={(e) => {
                  onChangeStatusAkad(e);
                }}
                value={status < 5 ? 0 : status}
                options={[
                  {
                    value: 0,
                    label: '-',
                  },
                  {
                    value: 6,
                    label: 'Akad kredit dalam proses, mohon lengkapi data Anda',
                  },
                  {
                    value: 7,
                    label: 'Proses tanda tangan',
                  },
                  {
                    value: 8,
                    label: 'Akad kredit selesai',
                  },
                ]}
              />
            </Col>
            <Divider />
            {pertanyaanAkad[0]?.pertanyaan_akads.length === 0 ? (
              <>
                <Col span={24}>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => onAddAkadField()}
                    disabled={status < 6 || pinjaman?.status === 2}
                    className='mr-2'
                  >
                    Tambah Field
                  </Button>
                  <Button icon={<MinusOutlined />} disabled={akadField.length < 2 || status < 6 || pinjaman?.status === 2} onClick={onRemoveAkadField}>
                    {t('Kurangi Field')}
                  </Button>
                </Col>
                <Col span={24}>
                  <Form form={akadFormDua} layout='vertical' autoComplete='off' onFinish={onSubmitAkadKreditBorrower}>
                    {akadField?.map((item, key) => (
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
                              onChangeQuestionAkad(item.id, 'pertanyaan', value);
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
                    <Row>
                      <Col span={20}> </Col>
                      <Col span={4}>
                        {akadField.length >= 1
                          && (
                            <Form.Item className='mb-0'>
                              <Button type='primary' disabled={status <= 4 || pinjaman?.status === 2} block htmlType='submit'>
                                {t('button:submit')}
                              </Button>
                            </Form.Item>
                          )}
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </>
            ) : (
              <Col span={24}>
                <Form form={akadForm} layout='vertical' autoComplete='off'>
                  {pertanyaanAkad[0]?.pertanyaan_akads?.map((item, key) => (
                    <div key={key}>
                      <Form.Item
                        name={`pertanyaan_${key + 1}`}
                        label={`${item.pertanyaan}`}
                        className='mt-2'
                        initialValue={item.jawaban}
                        rules={[
                          { required: true, message: t('validation:required', { field: `Pertanyaan ke-${key + 1}` }) },
                        ]}
                      >
                        <Input
                          placeholder={t('placeholder:enter', { field: `Jawaban ke-${key + 1}` })}
                          disabled
                          onBlur={(e) => {
                            const { value } = e.target;
                            onChangeQuestionAkad(item.id, 'pertanyaan', value);
                          }}
                        />
                      </Form.Item>
                      {item.assets_akad_credits.length >= 1 && (
                        <List
                          bordered
                          itemLayout='horizontal'
                          dataSource={item.assets_akad_credits}
                          renderItem={(child, index) => (
                            <List.Item
                              actions={[
                                <Button type='link' onClick={() => onDeleteFilePertanyaanAkad(child.id)} style={{ color: 'red' }} key={index}>Hapus</Button>,
                                <Button type='link' key={index}><a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>Lihat</a></Button>,
                                <Button type='link' disabled={child.approval === true ? true : child.approval === false || pinjaman?.status === 2} onClick={() => onApproveDokumenAkad(child.id, true)} key={index}>Dokumen Benar</Button>,
                                <Button type='link' disabled={child.approval === true ? true : child.approval === false || pinjaman?.status === 2} onClick={() => onApproveDokumenAkad(child.id, false)} key={index}>Tidak Sesuai</Button>,
                              ]}
                            >
                              <Skeleton title={false} loading={loading} active={loading}>
                                <List.Item.Meta
                                  avatar={<Image preview={false} width={30} src={child.approval === true ? '/img/green-check-list.png' : child.approval === false ? '/img/red-cross.png' : '/img/transparent.png'} />}
                                  title={<a href={`${child.path}`} target='_blank' rel='noopener noreferrer'>{child.file_name}</a>}
                                />
                              </Skeleton>
                            </List.Item>
                          )}
                        />
                      )}
                    </div>
                  ))}
                  <Row>
                    <Col span={20}> </Col>
                    <Col span={4}>
                      <Form.Item className='mb-3 mt-3'>
                        <Button type='primary' disabled={[8, 7].includes(status) || status <= 6 || status === undefined || pinjaman?.status === 2} block htmlType='submit'>
                          {t('button:submit')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            )}
          </Row>
        ) : (
          <div />
        )}
      </Card>
      {(user.data?.userRole === 0) && (
        <Card title='Signing Notes'>
          {finalisasi !== null && (
            <Col span={24}>
              {finalisasi[0]?.notes !== null ? (
                <Text>{finalisasi[0]?.notes}</Text>
              ) : (
                <Text>-</Text>
              )}
            </Col>
          )}
        </Card>
      )}
      {(user.data?.userRole === 1 || user.data?.userRole === 9) && (
        <Card title='Admin Action'>
          <Row gutter={[24, 24]}>
            {finalisasi !== null && (
              <Col span={24}>
                {finalisasi[0]?.notes !== null ? (
                  <Text>{finalisasi[0]?.notes}</Text>
                ) : (
                  <Text>-</Text>
                )}
              </Col>
            )}
            <Col span={24}>
              <Space size='middle'>
                <Button disabled={status !== 8 || finalisasi[0]?.notes !== null || pinjaman?.status === 2} type='primary' onClick={() => setSigningNotesModal(true)}>
                  {t('Add Signing Notes')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
      <Modal title='Signing Notes' open={signingNotesModal} onCancel={() => setSigningNotesModal(false)} onOk={() => onApproveFinalization(false)} okText='Ya' cancelText='Batal'>
        <p>Apakah Seluruh Data Sudah Sesuai?</p>
        <div className='flex-row'>
          <TextArea rows={6} placeholder='Isi Signing Notes' onChange={(e) => setSigningNotes(e.target.value)} />
        </div>
      </Modal>
      <Modal
        title='Terima Proses Komite Kredit'
        open={processComiteeCreditModal}
        onCancel={() => setProcessComiteeCreditModal(false)}
        onOk={() => {
          onApproveDocumentCreditComiteeProcess(true);
          setProcessComiteeCreditModal(false);
        }}
        okText='Ya'
        cancelText='Batal'
      >
        <p>Yakin Lanjutkan Proses Komite Kredit?</p>
      </Modal>
      <Modal
        title='Tolak Proses Komite Kredit'
        open={tolakProcessComiteeCreditModal}
        onCancel={() => setTolakProcessComiteeCreditModal(false)}
        onOk={() => {
          onApproveDocumentCreditComiteeProcess(false);
          setTolakProcessComiteeCreditModal(false);
        }}
        okText='Ya'
        cancelText='Batal'
      >
        <p>Yakin Tolak Proses Komite Kredit?</p>
      </Modal>
      <Modal
        title='Buat Akad Kredit'
        open={akadKreditModal}
        onCancel={() => setAkadKreditModal(false)}
        onOk={() => {
          setAkadKreditModal(false);
          onSubmitAkad();
        }}
        okText='Ya'
        cancelText='Batal'
      >
        <p>Simpan pertanyaan</p>
      </Modal>
      <Modal
        title='Buat Proses Persetujuan Pemberi Pinjaman'
        open={lenderApprovalModal}
        onCancel={() => setlenderApprovalModal(false)}
        onOk={() => {
          setlenderApprovalModal(false);
          onSubmitLender();
        }}
        okText='Ya'
        cancelText='Batal'
      >
        <p>Simpan pertanyaan</p>
      </Modal>
    </>
  );
}

Tambah.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={6}>
      {page}
    </AppLayout>
  );
};

export default Tambah;
