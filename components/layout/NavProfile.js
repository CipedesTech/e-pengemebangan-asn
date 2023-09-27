import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Menu, Dropdown, Avatar, Typography, Modal } from 'antd';
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

  function capital(string) {
    let data;
    if (string != null) {
      data = string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      data = '-';
    }
    return data;
  }

  const onProfile = () => {
    router.push('/profile');
  };

  const onLogout = () => {
    confirm({
      title: t('Confirm Logout'),
      content: t('placeholder:confirm-logout'),
      icon: null,
      cancelText: t('button:cancel'),
      okType: 'danger',
      okText: t('Logout'),
      okButtonProps: { type: 'primary' },
      onOk() {
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

  const role = (userRole) => {
    let namaRole = '';
    if (userRole === 0) {
      namaRole = 'Peminjam';
    } else if (userRole === 1) {
      namaRole = 'Kredit Admin';
    } else if (userRole === 2) {
      namaRole = 'Kredit Analis';
    } else if (userRole === 9) {
      namaRole = 'Sales Admin';
    } else {
      namaRole = 'ASN';
    }

    return namaRole;
  };

  return (
    <Dropdown placement='bottomRight' overlay={profileMenu} trigger={['click']}>
      <div className='header-profile'>
        <Avatar style={avatarStyle} className='mr-2'>
          {initialName(user?.data?.userName ? user.data.userName : 'Nama ASN')}
        </Avatar>
        <div className='mr-3'>
          <Title style={{ fontSize: 14 }} className='font-weight-semibold mb-0'>{user?.data?.userName ? user.data.userName : 'Nama ASN'}</Title>
          <span style={{ fontSize: 12 }}>{capital(role(user?.data?.userRole)).toString().replace(/,/g, ' - ')}</span>
        </div>
        <DownOutlined />
      </div>
    </Dropdown>
  );
}

export default NavProfile;
