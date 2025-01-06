import Clock from '@/components/clock/Clock';
import TicketTable from '@/components/ticketTable/TicketTable';
import { prisma } from '@/lib/prisma';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { ReactElement } from 'react';

export default async function Timer(): Promise<ReactElement> {
  const tracks = await prisma.track?.findMany();
  return (
    <>
      <Title level={2}>Time tracker</Title>
      <Flex vertical gap="2rem" align="center">
        <Clock />
        <TicketTable data={tracks} />
      </Flex>
    </>
  );
}
