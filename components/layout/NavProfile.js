import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Menu, Dropdown, Avatar, Typography, Modal, message, Form, Input, Button } from 'antd';
import { DownOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';

import AuthenticationActions from 'stores/Authentication/Actions';

import { initialName, randomAvatarColor } from 'utils/Utils';
import Cookies from 'utils/Cookies';
import AuthService from 'services/AuthService';

const { Title } = Typography;
const { confirm } = Modal;

function NavProfile() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [avatarBackground] = useState(randomAvatarColor());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onProfile = () => {
    // router.push('/profile');
    setIsModalOpen(true);
  };

  const onFinishForm = async (e) => {
    setLoading(true);
    try {
      const payload = {
        id: user.id,
        newPassword: e.newPassword,
        currentPassword: e.currentPassword,
      };
      const update = await AuthService.changePassword(payload);
      if (update.status !== 200) return message.warning('Update gagal');
      message.success('update password berhasil');
      Cookies.clearData();
      localStorage.clear();
      router.push('/auth/sign-in');
    } catch (err) {
      return message.error('Terjadi kesalahan pada server');
    }
    setLoading(false);
  };

  const onLogout = () => {
    confirm({
      title: 'Konfirmasi logout',
      content: t('placeholder:confirm-logout'),
      icon: null,
      cancelText: t('button:cancel'),
      okType: 'danger',
      okText: t('Logout'),
      okButtonProps: { type: 'primary' },
      onOk() {
        message.success('logout');
        // dispatch(AuthenticationActions.logoutUser());
        Cookies.clearData();
        localStorage.clear();
        router.push('/auth/sign-in');
      },
    });
  };

  const avatarStyle = {
    color: '#FFFFFF',
    backgroundColor: avatarBackground,
  };

  const profileMenu = (
    <div className='nav-profile nav-dropdown'>
      <div className='nav-profile-body'>
        <Menu
          mode='vertical'
          onClick={({ key }) => {
            if (key === 'changePassword') {
              onProfile();
            } else {
              onLogout();
            }
          }}
          items={[
            {
              key: 'logout',
              label: t('Logout'),
              icon: <LogoutOutlined />,
            },
            {
              key: 'changePassword',
              label: 'Ganti kata sandi',
              icon: <KeyOutlined />,
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <>
      <Dropdown placement='bottomRight' overlay={profileMenu} trigger={['click']}>
        <div className='header-profile'>
          <Avatar style={avatarStyle} className='mr-2'>
            {initialName(user?.name ? user?.name : 'Nama ASN')}
          </Avatar>
          <div className='mr-3'>
            <Title style={{ fontSize: 14 }} className='font-weight-semibold mb-0'>{user?.name ? user?.name : 'Nama ASN'}</Title>
            <span style={{ fontSize: 12 }}>{user?.role}</span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
      <Modal title='Ganti Password' open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form
          form={form}
          layout='vertical'
          name='basic'
          onFinish={onFinishForm}
          autoComplete='off'
        >
          <Form.Item
            label='Password saat ini'
            name='currentPassword'
            rules={[
              { required: true },
            ]}
          >
            <Input placeholder='Password saat ini' type='password' />
          </Form.Item>
          <Form.Item
            label='Password baru'
            name='newPassword'
            rules={[
              { required: true },
            ]}
          >
            <Input placeholder='Password Baru' type='password' />
          </Form.Item>
          <Form.Item
            label='Konfirmasi password'
            name='reNewPassword'
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password tidak sama!'));
                },
              }),
            ]}
          >
            <Input placeholder='Ketik ulang password' type='password' />
          </Form.Item>
          <Form.Item>
            <Button disabled={loading} type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button disabled={loading} type='danger' style={{ marginLeft: '4px' }} onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default NavProfile;
