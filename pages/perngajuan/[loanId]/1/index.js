import AppLayout from 'layouts/app-layout';

import {
  Card,
  Col,
  Divider,
  Empty,
  Progress,
  Row,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import LoanListService from 'services/LoanListService';
import DataSubmissionService from 'services/DataSubmissionService';
import { useSelector } from 'react-redux';
import { formatRupiah } from 'utils/Utils';

const { Title, Text } = Typography;

function Pengajuan1Detail() {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const [pinjaman, setPinjaman] = useState({});

  useEffect(() => {
    // eslint-disable-next-line valid-typeof
    if (typeof (window) !== undefined) {
      setPinjaman(JSON.parse(window.localStorage.getItem('pinjaman')));
    }
  }, []);

  const fetchProgress = () => {
    DataSubmissionService.getProgress(pinjaman?.pinjaman_id)
      .then((res) => setProgress(res.progress))
      .catch(() => {
        setProgress(0);
      });
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) fetchProgress();
  }, [pinjaman]);

  const fetchUserLoanList = () => {
    setLoading(true);
    LoanListService.getDetailUserLoanList({
      userId: user?.type === 'borrower' ? user?.data?.userId : pinjaman?.borrower_id,
      loanId: pinjaman?.pinjaman_id,
    })
      .then((res) => {
        setDetail(res.data);
      }).catch(() => {
        // do nothing
      }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (pinjaman?.pinjaman_id !== undefined) {
      fetchUserLoanList();
    }
  }, [pinjaman]);

  return (
    <div>
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
      {(detail !== null) ? (
        <div style={{ backgroundColor: 'whitesmoke' }}>
          <Row gutter={[12, 12]} className='mx-0'>
            <Col span={24} className='pl-4 py-2' style={{ backgroundColor: '#DE0000', color: 'white' }}>
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>Detail Pinjaman</span>
            </Col>
            <Col span={24} className='px-4 py-4'>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Card loading={loading}>
                    <Title level={2} className='text-center'>{detail.package}</Title>
                    <br /><br /><br /><br /><br />
                    <Row gutter={[12, 12]}>
                      <Col span={12}>
                        <Text strong>Transaksi ID:</Text>
                        <br /><br />
                        <Text strong>Status:</Text>
                      </Col>
                      <Col span={12}>
                        <Text>{detail.transId}</Text>
                        <br /><br />
                        <Text>{(detail.status === 0 ? 'Baru' : 'Ditolak')}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <Card loading={loading} className='text-center' style={{ backgroundColor: '#DE0000', color: 'white' }}>
                        <Text strong style={{ color: 'white' }}>Nilai Pengajuan</Text>
                        <br /><br />
                        <Title level={3} style={{ color: 'white' }}>{formatRupiah(detail?.amount, 'Rp. ')}</Title>
                      </Card>
                      <Card loading={loading} className='text-center' style={{ backgroundColor: '#DE0000', color: 'white' }}>
                        <Text strong style={{ color: 'white' }}>Bunga</Text>
                        <br /><br />
                        <Title level={3} style={{ color: 'white' }}>{parseFloat(detail.rate, 10).toFixed(2)}%</Title>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card loading={loading} className='text-center' style={{ backgroundColor: '#DE0000', color: 'white' }}>
                        <Text strong style={{ color: 'white' }}>Metode Bunga</Text>
                        <br /><br />
                        <Title level={3} style={{ color: 'white' }}>Flat</Title>
                      </Card>
                      <Card loading={loading} className='text-center' style={{ backgroundColor: '#DE0000', color: 'white' }}>
                        <Text strong style={{ color: 'white' }}>Pengenaan Bunga</Text>
                        <br /><br />
                        <Title level={3} style={{ color: 'white' }}>Pertahun</Title>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col span={6}> </Col>
                        <Col span={12}>
                          <Card loading={loading} className='text-center' style={{ backgroundColor: '#DE0000', color: 'white' }}>
                            <Text strong style={{ color: 'white' }}>Tenor</Text>
                            <br /><br />
                            <Title level={3} style={{ color: 'white' }}>{detail.tenor} Bulan</Title>
                          </Card>
                        </Col>
                        <Col span={6}> </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
}

Pengajuan1Detail.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Pengajuan' onTab={1}>
      {page}
    </AppLayout>
  );
};

export default Pengajuan1Detail;
