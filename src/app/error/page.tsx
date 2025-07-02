'use client';

import { ReactElement } from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function Error(): ReactElement {
  const { push } = useRouter();
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button onClick={() => push('/dashboard')} type="primary">
          Back Home
        </Button>
      }
    />
  );
}
