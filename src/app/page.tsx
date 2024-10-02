import { ReactElement, Suspense } from "react";
import { Button, Flex, Spin } from "antd";
import { AlignLeftOutlined, DownloadOutlined, FilterOutlined, LoadingOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import DashboardCard from "@/components/DashboardCard";

export default async function Home(): Promise<ReactElement> {
  let data = await fetch('https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay');
  let chartData = await data.json();
  return (
    <Suspense fallback={<Spin indicator={<LoadingOutlined spin />} />}>
      <Flex gap={24} vertical>
        <Flex gap="small" align="center" justify="space-between">
          <Title level={5}>Page title</Title>
          <Flex gap="large" wrap>
            <Button icon={<DownloadOutlined />} size="large" iconPosition="end">
              Export to PDF
            </Button>
            <Button icon={<AlignLeftOutlined />} size="large" iconPosition="end">
              Notes <Text type="secondary">(3)</Text>
            </Button>
            <Button
              icon={[
                <FilterOutlined />
              ]}
              size="large"
              iconPosition="end"
              >
              <Button type="primary" shape="circle" size="small">
                9+
              </Button>
              Filter
            </Button>
          </Flex>
        </Flex>
        <DashboardCard chartData={chartData} />
      </Flex>
    </Suspense>
  );
}
