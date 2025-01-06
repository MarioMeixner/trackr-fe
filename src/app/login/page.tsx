import { ReactElement, Suspense } from 'react';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import LoginForm from '@/components/loginForm/LoginForm';
import Text from 'antd/es/typography/Text';
import Link from 'antd/es/typography/Link';

export default function Login(): ReactElement {
  return (
    <Suspense>
      <Flex justify="center" gap={50}>
        <Flex vertical style={{ width: '27rem' }}>
          <Title level={1}>trackr</Title>
          <Text
            type="secondary"
            style={{ fontSize: '1.25em', marginBottom: '1.25rem' }}
          >
            Track smarter, report <b>faster</b>! 🚀
            <br />
            Boost your productivity with our intuitive time tracking and
            reporting tool, designed specifically for developers. Stay on top of
            your tasks, optimize your workflow, and make every second count!
          </Text>
          <Link href="/">Learn more</Link>
        </Flex>
        <Flex gap={12} vertical>
          <Title level={4}>Sign in</Title>
          <LoginForm />
        </Flex>
      </Flex>
    </Suspense>
  );
}
