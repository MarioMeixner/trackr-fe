'use client';

import { ReactElement } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import TicketTable from './table/TicketTable';
import useSWR from 'swr';
import { Track } from '@prisma/client';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetcher } from '@/utils';

export default function TrackList(): ReactElement {
  const {
    data: { tracks } = {},
    isLoading: getTracksLoading,
    error,
  } = useSWR<{
    tracks: Track[];
  }>('/api/track', fetcher);

  if (getTracksLoading) {
    return <Spin indicator={<LoadingOutlined spin />} />;
  }

  return (
    <ErrorBoundary errorStatus={error?.status as number}>
      <TicketTable data={tracks} />
    </ErrorBoundary>
  );
}
