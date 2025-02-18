'use client';

import { ReactElement } from 'react';
import TicketTable from './table/TrackTable';
import { Flex } from 'antd';
import { components } from '@/lib/api';

export default function TrackList({
  data,
}: {
  data?: Array<components['schemas']['TrackEntity']>;
}): ReactElement {
  // if (getTracksLoading) {
  //   return <Spin indicator={<LoadingOutlined spin />} />;
  // }

  return (
    <Flex gap="0.5rem" align="flex-start" vertical>
      {/* <ErrorBoundary errorStatus={error?.status as number}> */}
      <TicketTable data={data} />
      {/* </ErrorBoundary> */}
    </Flex>
  );
}
