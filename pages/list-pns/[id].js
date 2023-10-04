import { ArrowLeftOutlined, DownloadOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Typography } from 'antd';
import AppLayout from 'layouts/app-layout';
import PnsService from 'services/PnsService';
import PropTypes from 'prop-types';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { useRouter } from 'next/router';

const { Text } = Typography;
const { Meta } = Card;

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await PnsService.getPnsById(id);
  const { data } = res;
  console.log(data);
  return { props: { data: data.data } };
}

function DetailASN({ data }) {
  const router = useRouter();
  return (
    <Row gutter={ROW_GUTTER}>
      <Col span={24}>
        <div className='d-flex align-items-center justify-content-end'>
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
            onClick={() => router.push(`/rencana-pengembangan/data-diri?nip=${data.nip}`)}
          >
            Daftarkan Diklat
          </Button>

        </div>
      </Col>
      <Col span={24}>
        <Card title='DETAIL ASN' bordered={true} style={{ width: '100%' }}>
          <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
            <Col span={12}>
              <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
                <Col span={16}>
                  <Text>NIP</Text>
                </Col>
                <Col span={8}>
                  <Text strong>{data.nip}</Text>
                </Col>
              </Row>
              <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
                <Col span={16}>
                  <Text>Nama Lengkap</Text>
                </Col>
                <Col span={8}>
                  <Text strong>{data.nama_pegawai}</Text>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={16}>
                  <Text>Status</Text>
                </Col>
                <Col span={8}>
                  <Text strong>{data.status_kepegawaian}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card title='DATA DIKLAT' bordered={true} style={{ width: '100%' }}>
          <Row justify='center'>
            <Card
              style={{ width: '15vw', margin: '20px' }}
              cover={(
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
            )}
              actions={[
                <InfoCircleOutlined key='info' />,
                <DownloadOutlined key='download' />,
              ]}
            >
              <Meta
                title='Uji Kompetensi 1'
                description='Pelatihan Uji Kompetensi'
              />
            </Card>
            <Card
              style={{ width: '15vw', margin: '20px' }}
              cover={(
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
            )}
              actions={[
                <InfoCircleOutlined key='info' />,
                <DownloadOutlined key='download' />,
              ]}
            >
              <Meta
                title='Uji Kompetensi 2'
                description='Pelatihan Uji Kompetensi berbasis TIK'
              />
            </Card>
            <Card
              style={{ width: '15vw', margin: '20px' }}
              cover={(
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
            )}
              actions={[
                <InfoCircleOutlined key='info' />,
                <DownloadOutlined key='download' />,
              ]}
            >
              <Meta
                title='Uji Kompetensi 3'
                description='Pelatihan Uji Kompetensi berbasis Wawasan Kebangsaan'
              />
            </Card>
            <Card
              style={{ width: '15vw', margin: '20px' }}
              cover={(
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
            )}
              actions={[
                <InfoCircleOutlined key='info' />,
                <DownloadOutlined key='download' />,
              ]}
            >
              <Meta
                title='Uji Kompetensi 4'
                description='Pelatihan Uji Kompetensi'
              />
            </Card>
            <Card
              style={{ width: '15vw', margin: '20px' }}
              cover={(
                <img
                  alt='example'
                  src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                />
            )}
              actions={[
                <InfoCircleOutlined key='info' />,
                <DownloadOutlined key='download' />,
              ]}
            >
              <Meta
                title='Uji Kompetensi 5'
                description='Pelatihan Uji Kompetensi'
              />
            </Card>
          </Row>
        </Card>
      </Col>

    </Row>
  );
}

DetailASN.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Detail ASN' onTab='detail_asn' extra={false}>
      {page}
    </AppLayout>
  );
};

DetailASN.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DetailASN;
