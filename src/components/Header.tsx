'use client';

import { ReactElement } from 'react';
import { Header as AppHeader } from 'antd/es/layout/layout';
import { signOut, useSession } from 'next-auth/react';
import { Button } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import logo from '@/assets/logo.svg';
import Image from 'next/image';

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
      }}
    >
      <Image src={logo} alt="trackr" width="100" />
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
