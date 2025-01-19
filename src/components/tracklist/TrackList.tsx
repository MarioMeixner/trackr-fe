'use client';

import { ReactElement } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import TicketTable from './table/TrackTable';
import useSWR from 'swr';
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetcher } from '@/utils';
import { Track } from '@/types';

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
    <Flex gap="0.5rem" align="flex-start" vertical>
      <ErrorBoundary errorStatus={error?.status as number}>
        <TicketTable data={tracks} />
      </ErrorBoundary>
    </Flex>
  );
}
