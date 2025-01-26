'use client';

import { TrackEntity } from '@/api/generated-api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectTracker,
  setIsEditing,
  setTrackToEdit,
} from '@/redux/slices/trackerSlice';
import { Flex, notification, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { ReactElement } from 'react';
import { mutate } from 'swr';

export default function TrackTable({
  data,
}: {
  data?: TrackEntity[];
}): ReactElement<TrackEntity[]> {
  const dispatch = useAppDispatch();
  const { isEditing } = useAppSelector(selectTracker);
  const [notificationApi, contextHolder] = notification.useNotification();

  const edit = (record: Partial<TrackEntity> & { id: string }) => {
    dispatch(setIsEditing(true));
    dispatch(
      setTrackToEdit({
        id: record.id,
        date: record.date || undefined,
        duration: record.duration || '',
        title: record.title || '',
        description: record.description || '',
      })
    );
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/track', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error('Failed to delete track');
    }

    mutate('/api/track');
    notificationApi.success({
      message: 'Track deleted successfully',
      placement: 'bottomRight',
    });
  };

  const cancel = () => {
    dispatch(setIsEditing(false));
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      editable: true,
      render: (_: unknown, record: TrackEntity) => {
        return <span>{dayjs(record.date).format('DD.MM.YYYY')}</span>;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      editable: true,
    },
    {
      title: 'Spent time',
      dataIndex: 'duration',
      key: 'duration',
      width: '25%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '20%',
      render: (_: unknown, record: TrackEntity) => {
        return (
          <Flex justify="space-around">
            <Typography.Link disabled={isEditing} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={() => handleDelete(record.id)}
              type="danger"
            >
              Delete
            </Typography.Link>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Table<TrackEntity>
        rowKey={(record) => record.id}
        bordered
        dataSource={data}
        columns={columns}
        rowClassName="editable-row"
        pagination={{ onChange: cancel }}
        style={{ width: '60rem' }}
      />
      {contextHolder}
    </>
  );
}
