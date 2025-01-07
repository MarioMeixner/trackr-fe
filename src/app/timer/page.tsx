import { ReactElement } from 'react';
import Clock from '@/components/clock/Clock';
import TicketTable from '@/components/ticketTable/TicketTable';
import { prisma } from '@/lib/prisma';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { today } from '@/constants';

export default async function Timer(): Promise<ReactElement<void>> {
  const { start, end } = today();
  const tracks = await prisma.track?.findMany({
    where: { date: { gte: start, lte: end } },
  });
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
