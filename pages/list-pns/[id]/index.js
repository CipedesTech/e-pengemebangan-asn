import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import AppLayout from 'layouts/app-layout';

const { Title, Text } = Typography;
const { Meta } = Card;

function DetailASN1() {
  return (
    <>
      <Card title='DETAIL ASN' bordered={true} style={{ width: '100%' }}>
        <Row gutter={[12, 12]} style={{ marginTop: '12px' }}>
          <Col span={12}>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={8}>
                <Text>NIP</Text>
              </Col>
              <Col span={8}>
                <Title> </Title>
              </Col>
              <Col span={8}>
                <Text strong>112233</Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]} style={{ paddingBottom: '8px' }}>
              <Col span={8}>
                <Text>Nama Lengkap</Text>
              </Col>
              <Col span={8}>
                <Title> </Title>
              </Col>
              <Col span={8}>
                <Text strong>Muhammad Rafli Naufal</Text>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              <Col span={8}>
                <Text>Status</Text>
              </Col>
              <Col span={8}>
                <Title> </Title>
              </Col>
              <Col span={8}>
                <Text strong>Aktif</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card title='DATA DIKLAT' bordered={true} style={{ width: '100%' }}>
        <Row justify='start'>
          <Card
            style={{ width: 300, marginRight: '52px' }}
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
            style={{ width: 300, marginRight: '52px' }}
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
            style={{ width: 300, marginRight: '52px' }}
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
            style={{ width: 300, marginRight: '52px' }}
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
            style={{ width: 300, marginRight: '52px' }}
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
    </>
  );
}

DetailASN1.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Detail ASN' key={1} extra={false} onTab={0}>
      {page}
    </AppLayout>
  );
};

export default DetailASN1;
