'use client';

import { ReactElement } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Typography,
} from 'antd';
import { CommentOutlined, UserOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { CaseRecord, ChartData, PayloadData } from '@/types';

const { Text } = Typography;

export default function DashboardCard({
  chartData,
}: {
  chartData: PayloadData;
}): ReactElement<PayloadData> {
  const data = chartData.results?.map(
    (item: CaseRecord) =>
      ({
        type: item.date,
        value: item.metric_value,
      }) as ChartData
  );

  const pieConfig = {
    data,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 40,
          fontStyle: 'bold',
        },
      },
    ],
  };

  const columnConfig = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      text: (originData: ChartData) => {
        const val = parseFloat(originData.value as string);
        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
        return '';
      },
      offset: 10,
    },
  };

  return (
    <Row gutter={[24, 16]}>
      <Col md={24} lg={12}>
        <Card title="Attendance 🏢">
          <div>
            <Column {...columnConfig} height={300} />
            <Divider />
            <Flex justify="space-between">
              <Avatar icon={<UserOutlined />} />
              <Flex wrap align="center" gap={4}>
                <Text type="secondary">3</Text>
                <Button shape="circle" icon={<CommentOutlined />} />
              </Flex>
            </Flex>
          </div>
        </Card>
      </Col>
      <Col md={24} lg={12}>
        <Card title="Coding time 👨‍💻">
          <Pie {...pieConfig} height={300} />
          <Divider />
          <Flex justify="space-between">
            <Avatar icon={<UserOutlined />} />
            <Flex wrap align="center" gap={4}>
              <Text type="secondary">3</Text>
              <Button shape="circle" icon={<CommentOutlined />} />
            </Flex>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
}
