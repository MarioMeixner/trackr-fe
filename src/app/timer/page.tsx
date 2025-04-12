export const dynamic = 'force-dynamic';

import { ReactElement } from 'react';
import Clock from '@/components/clock/Clock';
import { Col, Row } from 'antd';
import TrackList from '@/components/tracklist/TrackList';
import { fetchTracks } from '@/api/tracksApi';

export default async function Timer(): Promise<ReactElement> {
  const data = await fetchTracks();
  return (
    <>
      <Row>
        <Col span={12}>
          <Clock />
        </Col>
        <Col span={12}>
          <TrackList data={data} />
        </Col>
      </Row>
    </>
  );
}
