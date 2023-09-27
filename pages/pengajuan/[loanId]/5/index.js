/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';

import AppLayout from 'layouts/app-layout';

import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Typography,
} from 'antd';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { useTranslation } from 'react-i18next';
import ScoringService from 'services/ScoringService';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import DataSubmissionService from 'services/DataSubmissionService';
import VisitScheduleService from 'services/VisitScheduleService';
import LoanListService from 'services/LoanListService';

const { Paragraph, Title, Text } = Typography;
const { TextArea } = Input;

function Pengajuan5() {
  const router = useRouter();
  const { loanId } = router.query;
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openDissaprove, setOpenDissaprove] = useState(false);
  const [statusKonfirmasi, setStatusKonfirmasi] = useState(false);
  const [params, setParams] = useState({
    id_debitur: user?.data?.userRole === 0 ? loanId : null,
  });
  const [approveData, setApproveData] = useState({});
  const [status, setStatus] = useState(0);
  const [data, setData] = useState(null);
  const [reason, setReason] = useState('');
  const [pinjaman, setPinjaman] = useState({});
  const [progress, setProgress] = useState(null);

  const fetchProgress = () => {
    DataSubmissionService.getProgress(loanId)
      .then((res) => setProgress(res.progress))
      .catch((err) => err.pesan);
  };

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

  useEffect(() => {
    if (pinjaman.pinjaman_id !== null) {
      fetchProgress();
    }
  }, [pinjaman]);

  const fetchDetail = () => {
    setLoading(true);
    VisitScheduleService.getDetailVisitAdmin(pinjaman.pinjaman_id)
      .then((res) => {
        setStatusKonfirmasi(res.data?.AssetsVisitResults.length > 0);
      })
      .catch(() => {
        setStatusKonfirmasi(null);
      })
      .finally(() => setLoading(false));
  };

  const findTID = () => {
    setLoading(true);
    ScoringService.getResultScoring({ params })
      .then((res) => {
        setStatus(1);
        setData(res);
      }).catch((err) => {
        message.error(err.data.data);
      }).finally(() => setLoading(false));
  };

  const fetchScoring = () => {
    setLoading(true);
    ScoringService.getApprovedScoring(loanId)
      .then((res) => {
        setStatus(1);
        setData({
          data: [
            res.data,
          ],
        });
      }).catch((err) => {
        if (err.data.data) {
          message.error(err.data.data);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== null) {
      fetchDetail();
      fetchScoring();
    }
  }, [pinjaman, loanId]);

  const showModalApprove = () => {
    setOpenApprove(true);
  };
  const showModalDissaprove = () => {
    setOpenDissaprove(true);
  };

  const onApprove = (condition) => {
    setLoading(true);
    const payload = {
      data: {
        pinjaman_id: loanId,
        borrower_id: parseInt(pinjaman?.borrower_id, 10),
        approved: condition,
        note: condition === false ? 'Mohon maaf, pengajuan Anda tidak disetujui. Terima kasih atas permohonan pinjaman Anda saat ini, permohonan pengajuan pinjaman Anda belum bisa disetujui.' : reason,
        score: data?.data[0]['total score'],
        grade: data?.data[0].grade,
      },
    };
    ScoringService.putApproveScoringAnalyst(payload).then((res) => {
      message.success(res.pesan);
    }).catch((err) => {
      message.error(err);
    }).finally(() => {
      setApproveData(payload.data);
      setLoading(false);
      setOpenApprove(false);
      setOpenDissaprove(false);
      if (condition === true) {
        router.push(`/pengajuan/${pinjaman.pinjaman_id}/6`);
      }
    });
  };

  const onDissaprove = () => {
    DataSubmissionService.putNotesRejectionAdmin({
      id: pinjaman.pinjaman_id,
      data: {
        adminNotes: 'Mohon maaf, pengajuan Anda tidak disetujui. Terima kasih atas permohonan pinjaman Anda saat ini, permohonan pengajuan pinjaman Anda belum bisa disetujui.',
      },
    }).then(() => {
      onApprove(false);
      setOpenDissaprove(false);
      fetchLoanDetail();
      router.push(`/pengajuan/${pinjaman.pinjaman_id}/6`);
    }).catch((err) => {
      message.error(err.pesan);
    });
  };

  const handleCancelApprove = () => {
    setOpenApprove(false);
  };

  const handleCancelDisapprove = () => {
    setOpenDissaprove(false);
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
      <Card className='card-table' title={t('Scoring Result')} loading={loading}>
        <Row gutter={ROW_GUTTER} className='my-4 ml-2'>
          {(status < 2 && user?.type === 'admin' && (user?.data?.userRole === 2)) ? (
            <>
              <Col span={24}>
                <Paragraph>Input TID Peminjam</Paragraph>
                <Row>
                  <Col span={12}>
                    <Input
                      placeholder={params.id_debitur}
                      onChange={(e) => setParams({
                        ...params,
                        id_debitur: e.target.value,
                      })}
                      disabled={data?.data[0]?.scoring_approved || pinjaman?.status === 2}
                      // value={params?.id_debitur || pinjaman.transaksi_id}
                      defaultValue={params?.id_debitur || pinjaman.transaksi_id}
                    />
                  </Col>
                  <Col span={4}>
                    <Button type='primary' disabled={statusKonfirmasi === false || data?.data[0]?.scoring_approved || pinjaman?.status === 2} className='ml-3' onClick={() => findTID()}>{t('Search')}</Button>
                  </Col>
                </Row>
              </Col>
              <Col span={12} className='ml-3'>
                <Row gutter={[24, 24]}>
                  <Col span={6} style={{ backgroundColor: '#de0000', color: 'white' }} className='p-3'>
                    <Paragraph style={{ color: 'white' }}>{t('Total Score')}</Paragraph>
                    <Title style={{ color: 'white' }}>{data?.data[0]['total score'] || data?.data[0].total_score || '-'}</Title>
                  </Col>
                  <Col span={6} style={{ backgroundColor: '#87d068' }} className='p-3'>
                    <Paragraph style={{ color: 'white' }}>{t('Grade')}</Paragraph>
                    <Title style={{ color: 'white' }}>{data?.data[0].grade || '-'}</Title>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Text strong>Catatan dari IKI Modal</Text>
                <br />
                {approveData == null ? (
                  <Text>
                    {approveData?.note ? approveData?.note.split('\n').map((item, key) => (
                      <Text key={key}>{item}
                        <br />
                      </Text>
                    )) : '-'}
                  </Text>
                ) : (
                  <Text>
                    {data?.data[0].note ? data?.data[0].note.split('\n').map((item, key) => (
                      <Text key={key}>{item}
                        <br />
                      </Text>
                    )) : '-'}
                  </Text>
                )}
              </Col>
            </>
          ) : (user?.type === 'borrower' || (user?.type === 'admin' && (user?.data?.userRole === 1 || user?.data?.userRole === 9))) ? (
            <>
              <Col span={24}>
                <Row>
                  <Col span={12}>
                    <Text strong>TID: {' '}</Text>
                    <Text>{pinjaman.transaksi_id}</Text>
                  </Col>
                </Row>
              </Col>
              <Col span={12} className='ml-3'>
                <Row gutter={[24, 24]}>
                  <Col span={6} style={{ backgroundColor: '#de0000', color: 'white' }} className='p-3'>
                    <Paragraph style={{ color: 'white' }}>{t('Total Score')}</Paragraph>
                    <Title style={{ color: 'white' }}>{data?.data[0]['total score'] || data?.data[0].total_score || '-'}</Title>
                  </Col>
                  <Col span={6} style={{ backgroundColor: '#87d068' }} className='p-3'>
                    <Paragraph style={{ color: 'white' }}>{t('Grade')}</Paragraph>
                    <Title style={{ color: 'white' }}>{data?.data[0].grade || '-'}</Title>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Text strong>Catatan dari IKI Modal</Text>
                <br />
                <Text>
                  {data?.data[0].note ? data?.data[0].note.split('\n').map((item, key) => (
                    <Text key={key}>{item}
                      <br />
                    </Text>
                  )) : '-'}
                </Text>
              </Col>
            </>
          ) : (status === 2) ? (
            <Col span={24}>
              <Paragraph>Gagal, proses skoring belum dilakukan</Paragraph>
            </Col>
          ) : (
            <div />
          )}
        </Row>
      </Card>
      {user?.data?.userRole === 2 && (
        <Row gutter={[12, 12]}>
          <Col span={18}> </Col>
          <Col span={3}>
            <Button
              onClick={() => showModalDissaprove()}
              block
              type='danger'
              disabled={status !== 1 || statusKonfirmasi === null || data?.data[0]?.scoring_approved || pinjaman?.status === 2}
            >
              {t('button:reject')}
            </Button>
          </Col>
          <Col span={3}>
            <Button
              type='primary'
              block
              onClick={() => showModalApprove()}
              disabled={status !== 1 || statusKonfirmasi === null || data?.data[0]?.scoring_approved || pinjaman?.status === 2}
            >
              {t('button:next')}
            </Button>
          </Col>
        </Row>
      )}
      <Modal
        open={openApprove}
        title={t('Confirmation')}
        onOk={onApprove}
        onCancel={handleCancelApprove}
        footer={[
          <Button key='Cancel' onClick={handleCancelApprove}>
            Return
          </Button>,
          <Button key='Submit' type='primary' loading={loading} onClick={() => onApprove(true)}>
            Submit
          </Button>,
        ]}
      >
        <TextArea rows={4} onChange={(e) => setReason(e.target.value)} />
      </Modal>
      <Modal
        open={openDissaprove}
        title={t('Reject Pengajuan')}
        onOk={() => onDissaprove()}
        onCancel={handleCancelDisapprove}
        footer={[
          <Button key='Cancel' onClick={handleCancelDisapprove}>
            Cancel
          </Button>,
          <Button key='Submit' type='primary' style={{ backgroundColor: 'red', color: 'white' }} loading={loading} onClick={() => onDissaprove()}>
            Reject
          </Button>,
        ]}
      >
        <div style={{ display: user?.data?.userRole === 2 && 'none' }}>
          <Paragraph>Catatan dari IkiModal: </Paragraph>
          <TextArea rows={4} onChange={(e) => setReason(e.target.value)} />
        </div>
      </Modal>
    </>
  );
}

Pengajuan5.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={5}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan5;
