'use client';

import { ReactElement } from 'react';
import { Header as AppHeader } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import { signOut, useSession } from 'next-auth/react';
import { Button } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export default function Header(): ReactElement {
  const { data: user } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        boxShadow: '0 5px 5px rgba(0,0,0,.1)',
      }}
    >
      <Title level={5}>Impoch</Title>
      {pathname !== '/login' && !user ? (
        <Button
          variant="link"
          color="default"
          onClick={() => router.push('/login')}
        >
          Sign in
        </Button>
      ) : user ? (
        <Button
          variant="link"
          color="default"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign out
        </Button>
      ) : null}
    </AppHeader>
  );
}
