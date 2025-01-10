import { ReactElement } from 'react';
import Clock from '@/components/clock/Clock';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import TrackList from '@/components/tracklist/TrackList';

export default function Timer(): ReactElement {
  return (
    <>
      <Title level={2}>Time tracker</Title>
      <Flex vertical gap="2rem" align="center">
        <Clock />
        <TrackList />
      </Flex>
    </>
  );
}
