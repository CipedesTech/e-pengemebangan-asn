import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Row, Col, Typography, Form, Input, Button, message } from 'antd';
import AuthLayout from 'layouts/auth-layout';
import AuthService from 'services/AuthService';
import AuthenticationActions from 'stores/Authentication/Actions';
import Cookies from 'utils/Cookies';
import { useDispatch } from 'react-redux';

const { Title, Paragraph } = Typography;

function SignIn() {
  const refreshToken = Cookies.getData('refreshToken');
  const token = Cookies.getData('accessToken') ?? refreshToken;
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (token) {
  //     router.push('/list-pinjaman');
  //   }
  // }, [token]);

  const onSubmit = async (payload) => {
    setLoading(true);
    message.success('Berhasil Login!');
    setLoading(false);
    router.push('/list-asn');

    // try {
    //   await AuthService.login({
    //     data: payload,
    //   }).then((result) => {
    //     if (result?.status === 200) {
    //       Cookies.setData('accessToken', result?.data?.accessToken);
    //       Cookies.setData('refreshToken', result?.data?.refreshToken);
    //       dispatch(AuthenticationActions.fetchUser());
    //       message.success('Berhasil Login!');
    //       setLoading(false);
    //     }
    //   });
    // } catch (error) {
    //   if (error?.status === 401) {
    //     message.error(error?.data?.pesan || 'Login Terlebih Dahulu');
    //   }
    // }

    // setLoading(false);
  };

  return (
    <Row justify='center'>
      <Col xs={24} sm={24} md={20} lg={11} xl={8}>
        <div className='text-center'>
          <Title level={1} className='mb-1'>{t('Sign In')}</Title>
          <Paragraph level={3}>Selamat datang kembali, untuk melanjutkan silahkan masukan akunmu.</Paragraph>
        </div>
        <Form
          form={form}
          layout='vertical'
          className='mt-4'
          onFinish={onSubmit}
        >
          <Form.Item
            name='username'
            label='Username / Nomer Telepon'
            className='mb-3'
            rules={[
              { required: true, message: 'Username / Nomer Telepon Wajib Diisi' },
            ]}
          >
            <Input
              placeholder='Username / Nomer Telepon'
              type='text'
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name='password'
            label={t('Password')}
            className='mb-3'
            rules={[
              { required: true, message: t('validation:required', { field: t('Password') }) },
            ]}
          >
            <Input.Password
              placeholder={t('placeholder:enter', { field: t('Password') })}
              type='text'
            />
          </Form.Item>
          <Form.Item className='mb-0 mt-4'>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              loading={loading}
              block
            >
              {t('button:sign-in')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

SignIn.getLayout = function getLayout(page) {
  return (
    <AuthLayout title='Sign In'>
      {page}
    </AuthLayout>
  );
};

export default SignIn;
