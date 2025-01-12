'use client';

import { ReactElement } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import TicketTable from './table/TicketTable';
import useSWR from 'swr';
import { Track } from '@prisma/client';
import { Button, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetcher } from '@/utils';
import { usePathname, useRouter } from 'next/navigation';

export default function TrackList({
  searchParams,
}: {
  searchParams?: { [_: string]: string };
}): ReactElement {
  const pathname = usePathname();
  const { replace } = useRouter();
  const url = searchParams?.query
    ? `/api/track?query=${searchParams?.query}`
    : 'api/track';
  const {
    data: { tracks } = {},
    isLoading: getTracksLoading,
    error,
  } = useSWR<{
    tracks: Track[];
  }>(url, fetcher);

  const handleSearch = (query: string): void => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  if (getTracksLoading) {
    return <Spin indicator={<LoadingOutlined spin />} />;
  }

  return (
    <Flex gap="0.5rem" align="flex-start" vertical>
      <ErrorBoundary errorStatus={error?.status as number}>
        <Flex gap="0.5rem">
          <Button type="primary" onClick={() => handleSearch('all')}>
            All
          </Button>
          <Button type="link" onClick={() => handleSearch('today')}>
            Today
          </Button>
        </Flex>
        <TicketTable data={tracks} />
      </ErrorBoundary>
    </Flex>
  );
}
