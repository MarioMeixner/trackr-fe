import Clock from '@/components/Clock';
import TicketTable from '@/components/TicketTable';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import { ReactElement } from 'react';

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
