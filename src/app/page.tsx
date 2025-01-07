import { ReactElement, Suspense } from 'react';
import { Badge, Button, Flex, Spin } from 'antd';
import {
  AlignLeftOutlined,
  DownloadOutlined,
  FilterOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import DashboardCard from '@/components/dashboardCard/DashboardCard';
import UserInfo from '@/components/userInfo/UserInfo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home(): Promise<ReactElement<void>> {
  const data = await fetch(
    'https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay'
  );
  const chartData = await data.json();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <Suspense fallback={<Spin indicator={<LoadingOutlined spin />} />}>
      <Flex gap={24} vertical>
        <Flex align="center" justify="space-between" wrap>
          {user?.name && <UserInfo username={user.name} />}
          <Flex gap="middle" wrap>
            <Button icon={<DownloadOutlined />} size="large" iconPosition="end">
              Export to PDF
            </Button>
            <Button
              icon={<AlignLeftOutlined />}
              size="large"
              iconPosition="end"
            >
              Notes <Text type="secondary">(3)</Text>
            </Button>
            <Badge color="blue" count={10} overflowCount={9}>
              <Button
                icon={[<FilterOutlined key="filter-icon" />]}
                size="large"
                iconPosition="end"
              >
                Filter
              </Button>
            </Badge>
          </Flex>
        </Flex>
        <DashboardCard chartData={chartData} />
      </Flex>
    </Suspense>
  );
}
