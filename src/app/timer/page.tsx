import { ReactElement } from 'react';
import Clock from '@/components/clock/Clock';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import TicketTable from '@/components/ticketTable/TicketTable';

export default function Timer(): ReactElement {
  return (
    <>
      <Title level={2}>Time tracker</Title>
      <Flex vertical gap="2rem" align="center">
        <Clock />
        <TicketTable />
      </Flex>
    </>
  );
}
