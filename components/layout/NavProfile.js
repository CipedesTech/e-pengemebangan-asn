import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Menu, Dropdown, Avatar, Typography, Modal, message } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';

import AuthenticationActions from 'stores/Authentication/Actions';

import { initialName, randomAvatarColor } from 'utils/Utils';

const { Title } = Typography;
const { confirm } = Modal;

function NavProfile() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [avatarBackground] = useState(randomAvatarColor());

  const onProfile = () => {
    router.push('/profile');
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
        dispatch(AuthenticationActions.logoutUser());
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
            if (key === 'profile') {
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
          ]}
        />
      </div>
    </div>
  );

  return (
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
  );
}

export default NavProfile;
