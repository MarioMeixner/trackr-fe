'use client';

import { ReactElement } from 'react';
import Image from 'next/image';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import google from '@/assets/google.png';
import github from '@/assets/github.svg';
import Text from 'antd/es/typography/Text';

export default function LoginForm(): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const onFinish = async (values: {
    username: string;
    password: string;
  }): Promise<void> => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.username,
        password: values.password,
        callbackUrl,
      });

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        console.error('Invalid email or password');
      }
    } catch (error: unknown) {
      console.error(error as string);
    }
  };

  const onFinishFailed = () => console.error('Finish failed');

  return (
    <Flex>
      <Flex vertical style={{ width: '16rem' }}>
        <Flex gap="1rem" vertical>
          <Button onClick={() => signIn('google', { callbackUrl })}>
            <Image src={google} alt="google-logo" width={16} height={16} />
            Sign in with Google
          </Button>
          <Button onClick={() => signIn('github', { callbackUrl })}>
            <Image src={github} alt="github-logo" width={16} height={16} />
            Sign in with Github
          </Button>
        </Flex>
        <Text
          type="secondary"
          style={{ textAlign: 'center', margin: '0.5rem 0' }}
        >
          Or
        </Text>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" style={{ width: '100%' }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
}
