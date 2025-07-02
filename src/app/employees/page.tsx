export const dynamic = 'force-dynamic';

import { ReactElement } from 'react';
import { Row } from 'antd';
import { fetchUsers } from '@/api/usersApi';
import UserList from '@/components/userList/UserList';
import Title from 'antd/es/typography/Title';

export default async function Employees(): Promise<ReactElement> {
  const data = await fetchUsers();
  return (
    <>
      <Row>
        <Title level={3}>Employees</Title>
      </Row>
      <Row>
        <UserList data={data} />
      </Row>
    </>
  );
}
