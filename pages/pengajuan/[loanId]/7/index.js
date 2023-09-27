/* eslint-disable prefer-template */
/* eslint-disable semi */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from 'react';
import AppLayout from 'layouts/app-layout';
import dayjs from 'dayjs';

import {
  Card,
  Col,
  Divider,
  List,
  message,
  Progress,
  Row,
  Steps,
  Typography,
} from 'antd';
import LoanTrackerService from 'services/LoanTrackerService';
import DataSubmissionService from 'services/DataSubmissionService';
import { dateSubtractWeekDayOnly } from 'utils/Utils';
import LoanListService from 'services/LoanListService';
import { useRouter } from 'next/router';

const { Title, Paragraph, Text } = Typography;

function Pengajuan7() {
  const router = useRouter();
  const { loanId } = router.query;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pinjaman, setPinjaman] = useState({});
  const [submissionBorrower, setSubmissionBorrower] = useState(null);

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

  const [progress, setProgress] = useState(null);

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

  const fetchLoanTracker = () => {
    setLoading(true);
    LoanTrackerService.getBorrowerLoanTracker({
      id: pinjaman.pinjaman_id,
    }).then((res) => {
      setData(res);
    }).catch((err) => {
      message.error(err.data?.pesan);
    }).finally(() => setLoading(false));
  };

  const fetchSubmission = () => {
    setLoading(true);
    DataSubmissionService.getDetailSubmissionUser(pinjaman?.pinjaman_id)
      .then((res) => {
        setSubmissionBorrower(res);
      });
  };

  useEffect(() => {
    if (pinjaman.pinjaman_id !== undefined) {
      fetchLoanTracker();
      fetchSubmission();
    }
  }, [pinjaman]);

  const listItem = (listdata) => {
    return (
      <List
        dataSource={listdata}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>[{dayjs(item.updatedAt).format('MMM DD, YYYY HH:mm:ss')}]</Typography.Text> {item.aktivitas_proses}
          </List.Item>
        )}
      />
    );
  };

  const dataTracker = data.loan_track_timeline?.map((item) => {
    return {
      title: item.tahapan_proses,
      description: listItem(item.SubLoanTracks),
    };
  });

  const dataTrackerLength = data.loan_track_timeline?.length - 1;
  const baseInputDate = submissionBorrower?.waktu_submisi ?? null;

  const DocumentVerificationSLA = 2
  const AnalystSLA = 2
  const VisitSLA = 2
  const ScoringSLA = 1
  const KomiteSLA = 1
  const LenderApprovalSLA = 2
  const AkadKreditSLA = 2
  const DisbursementSLA = 1

  let expectedDocumentVerification
  let expectedAnalyst
  let expectedVisit
  let expectedScoring
  let expectedKomite
  let expectedLenderApproval
  let expectedAkadKredit
  let expectedDisbursement

  if (data?.loan_track_timeline) {
    const actualDocumentVerification = data?.loan_track_timeline[0]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualAnalyst = data?.loan_track_timeline[1]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualVisit = data?.loan_track_timeline[2]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualScoring = data?.loan_track_timeline[3]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualKomite = data?.loan_track_timeline[4]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualLenderApproval = data?.loan_track_timeline[5]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'FND')[0]?.updatedAt ?? null;
    const actualAkadKredit = data?.loan_track_timeline[6]?.SubLoanTracks.filter((el) => el.id.split('_')[1] === 'VRF')[0]?.updatedAt ?? null;
    const actualDisbursement = data?.loan_track_timeline[7]?.SubLoanTracks.filter((el) => el.id.substring(0, 3) === 'FNL')[0]?.updatedAt ?? null;

    expectedDocumentVerification = actualDocumentVerification !== null ? dateSubtractWeekDayOnly(actualDocumentVerification) : dateSubtractWeekDayOnly(baseInputDate, DocumentVerificationSLA);
    expectedAnalyst = actualAnalyst !== null ? dateSubtractWeekDayOnly(actualAnalyst) : dateSubtractWeekDayOnly(expectedDocumentVerification, AnalystSLA);
    expectedVisit = actualVisit !== null ? dateSubtractWeekDayOnly(actualVisit) : dateSubtractWeekDayOnly(expectedAnalyst, VisitSLA);
    expectedScoring = actualScoring !== null ? dateSubtractWeekDayOnly(actualScoring) : dateSubtractWeekDayOnly(expectedVisit, ScoringSLA);
    expectedKomite = actualKomite !== null ? dateSubtractWeekDayOnly(actualKomite) : dateSubtractWeekDayOnly(expectedScoring, KomiteSLA);
    expectedLenderApproval = actualLenderApproval !== null ? dateSubtractWeekDayOnly(actualLenderApproval) : dateSubtractWeekDayOnly(expectedKomite, LenderApprovalSLA);
    expectedAkadKredit = actualAkadKredit !== null ? dateSubtractWeekDayOnly(actualAkadKredit) : dateSubtractWeekDayOnly(expectedLenderApproval, AkadKreditSLA);
    expectedDisbursement = actualDisbursement !== null ? dateSubtractWeekDayOnly(actualDisbursement) : dateSubtractWeekDayOnly(expectedAkadKredit, DisbursementSLA);
  }
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
        <Col span={8}>
          <Card style={{ backgroundColor: '#de0000' }} loading={loading}>
            <Title level={4} style={{ color: '#FFFFFF' }}>Loan {data?.data_pinjaman?.map((item) => item.transaksi_id)[0]}</Title>
            <Paragraph style={{ color: '#FFFFFF' }}>Borrower: {data?.data_pinjaman?.map((item) => item.borrower_name)[0]}</Paragraph>
            <Paragraph style={{ color: '#FFFFFF' }}>Status: {data?.data_pinjaman?.map((item) => item.status)[0] === 0 ? 'Baru' : 'Ditolak'}</Paragraph>
            <Title level={4} style={{ color: '#FFFFFF' }}>Date Estimated</Title>
            {submissionBorrower?.waktu_submisi === null ? (<Paragraph style={{ color: '#FFFFFF' }}> Borrower belum melakukan submit data </Paragraph>)
              : (
                <>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Document Verification: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedDocumentVerification}</Paragraph>
                    </Col>
                  </Row>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Analyst: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedAnalyst}</Paragraph>
                    </Col>
                  </Row>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Komite: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedKomite}</Paragraph>
                    </Col>
                  </Row>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Lender Approval: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedLenderApproval}</Paragraph>
                    </Col>
                  </Row>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Akad Kredit: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedAkadKredit}</Paragraph>
                    </Col>
                  </Row>
                  <Row gutter={[12, 12]}>
                    <Col span={12} className='mb-2'>
                      <Text style={{ color: '#FFFFFF' }}>Disbursement: </Text>
                    </Col>
                    <Col span={12}>
                      <Paragraph style={{ color: '#FFFFFF' }}>{expectedDisbursement}</Paragraph>
                    </Col>
                  </Row>
                </>
              )}
            <Title level={4} style={{ color: '#FFFFFF' }}>Dalam Proses</Title>
            <Paragraph style={{ fontSize: '24px', color: '#FFFFFF' }}>{`${progress}%`}</Paragraph>
          </Card>
        </Col>
        <Col span={16}>
          <Card loading={loading}>
            <Steps
              progressDot
              current={dataTrackerLength}
              direction='vertical'
              items={dataTracker}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

Pengajuan7.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={7}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan7;
