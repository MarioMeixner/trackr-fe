'use client';

import { ReactElement } from 'react';
import { Header as AppHeader } from 'antd/es/layout/layout';
import { signOut, useSession } from 'next-auth/react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import logo from '@/assets/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChartOutlined,
  ClockCircleOutlined,
  DownOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { logout } from '@/api/authApi';

export default function Header(): ReactElement<void> {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleTimerClick: MenuProps['onClick'] = () => {
    router.push('/timer');
  };

  const handleEmployeesClick: MenuProps['onClick'] = () => {
    router.push('/employees');
  };

  const handleSignOut = async () => {
    await logout();
    await signOut();
  };

  const items: MenuProps['items'] = [
    {
      key: 'timer',
      label: 'Timer',
      icon: <ClockCircleOutlined />,
      onClick: handleTimerClick,
    },
    {
      key: 'employees',
      label: 'Employees',
      icon: <BarChartOutlined />,
      onClick: handleEmployeesClick,
    },
    {
      key: 'signout',
      label: 'Sign out',
      icon: <RollbackOutlined />,
      onClick: handleSignOut as MenuProps['onClick'],
    },
  ];

  const menuProps = {
    items,
  };

  return (
    <AppHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <Link style={{ display: 'flex', alignItems: 'center' }} href="/dashboard">
        <Image src={logo} alt="trackr" width="100" />
      </Link>
      {pathname !== '/auth' && !session ? (
        <Button
          variant="link"
          color="default"
          onClick={() => router.push('/auth')}
        >
          Sign in
        </Button>
      ) : session ? (
        <Dropdown menu={menuProps} trigger={['click']}>
          <Button type="text">
            <Space>
              {session.user?.email}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      ) : null}
    </AppHeader>
  );
}
