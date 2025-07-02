'use client';

import { ReactElement } from 'react';
import UserTable from './table/UserTable';
import { Flex } from 'antd';
import { components } from '@/lib/api';

export default function UserList({
  data,
}: {
  data?: Array<components['schemas']['UserEntity']>;
}): ReactElement {
  return (
    <Flex gap="0.5rem" align="flex-start" vertical>
      <UserTable data={data} />
    </Flex>
  );
}
