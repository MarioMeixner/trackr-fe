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
  ClockCircleOutlined,
  DownOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

export default function Header(): ReactElement<void> {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleTimerClick: MenuProps['onClick'] = () => {
    router.push('/timer');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Timer',
      icon: <ClockCircleOutlined />,
      onClick: handleTimerClick,
    },
    {
      key: '2',
      label: 'Sign out',
      icon: <RollbackOutlined />,
      onClick: signOut as MenuProps['onClick'],
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
      <Link style={{ display: 'flex', alignItems: 'center' }} href="/">
        <Image src={logo} alt="trackr" width="100" />
      </Link>
      {pathname !== '/login' && !session ? (
        <Button
          variant="link"
          color="default"
          onClick={() => router.push('/login')}
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
