'use client';

import { ReactElement } from 'react';
import { Flex } from 'antd';
import { components } from '@/lib/api';
import IconButton from '@/components/iconButton/IconButton';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TrackList from '@/components/trackList/TrackList';
import Title from 'antd/es/typography/Title';

export default function UserDetail({
  user,
  tracks,
}: {
  user?: components['schemas']['UserEntity'];
  tracks?: Array<components['schemas']['TrackEntity']>;
}): ReactElement {
  const router = useRouter();
  return (
    <Flex gap="0.5rem" align="flex-start" vertical>
      <IconButton onClick={() => router.back()}>
        <ArrowLeftOutlined style={{ fontSize: '2em' }} />
      </IconButton>
      <Title level={3}>{(user?.name || '') as string}</Title>
      <TrackList data={tracks} />
    </Flex>
  );
}
