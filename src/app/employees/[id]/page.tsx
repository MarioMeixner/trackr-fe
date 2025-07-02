export const dynamic = 'force-dynamic';

import { ReactElement } from 'react';
import { Row } from 'antd';
import { fetchUser } from '@/api/usersApi';
import UserDetail from '@/components/userList/userDetail/UserDetail';
import { fetchTracksByUserId } from '@/api/tracksApi';

export default async function EmployeeDetail({
  params,
}: {
  params: { id: string };
}): Promise<ReactElement> {
  const user = await fetchUser(params.id);
  const tracks = await fetchTracksByUserId(params.id);
  return (
    <>
      <Row>
        <UserDetail user={user} tracks={tracks} />
      </Row>
    </>
  );
}
