'use client';

import { ReactElement } from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function NotFound(): ReactElement {
  const { push } = useRouter();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={() => push('/')} type="primary">
          Back Home
        </Button>
      }
    />
  );
}
