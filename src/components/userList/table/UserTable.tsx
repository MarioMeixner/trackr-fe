'use client';

import { components } from '@/lib/api';
import { useAppDispatch } from '@/redux/hooks';
import { setIsEditing } from '@/redux/slices/trackerSlice';
import { Table } from 'antd';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

type UserEntity = components['schemas']['UserEntity'];

export default function UserTable({
  data,
}: {
  data?: UserEntity[];
}): ReactElement<UserEntity[]> {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cancel = () => {
    dispatch(setIsEditing(false));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: '40%',
    },
  ];

  const openUserDetail = (record: UserEntity) => {
    router.push(`/employees/${record.id}`);
  };

  return (
    <Table<UserEntity>
      rowKey={(record) => record.id}
      bordered
      dataSource={data}
      columns={columns}
      pagination={{ onChange: cancel }}
      style={{ width: '60rem' }}
      size="middle"
      onRow={(record) => {
        return {
          onClick: () => openUserDetail(record),
        };
      }}
    />
  );
}
