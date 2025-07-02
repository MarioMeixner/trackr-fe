import { ReactElement, Suspense } from 'react';
import { Flex } from 'antd';
import Title from 'antd/es/typography/Title';
import LoginForm from '@/components/loginForm/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Text from 'antd/es/typography/Text';
import Link from 'antd/es/typography/Link';
import { FormEnum } from '@/constants';

export default function Auth({
  searchParams,
}: {
  searchParams?: { [_: string]: string };
}): ReactElement<void> {
  const isSignup = searchParams?.form === FormEnum.signUp;
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
          <Link href="/dashboard">Learn more</Link>
        </Flex>
        <Flex gap={12} vertical>
          <Title level={4}>{isSignup ? 'Register' : 'Sign in'}</Title>
          {isSignup ? <RegisterForm /> : <LoginForm />}
        </Flex>
      </Flex>
    </Suspense>
  );
}
