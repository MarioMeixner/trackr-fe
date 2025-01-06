import { ReactElement } from 'react';
import { Footer as AppFooter } from 'antd/es/layout/layout';
import { Flex, Typography } from 'antd';

export default function Footer(): ReactElement {
  return (
    <AppFooter>
      <Flex justify="center">
        <Typography>
          crafted with <b>Next.js</b> on 🌍
        </Typography>
      </Flex>
    </AppFooter>
  );
}
