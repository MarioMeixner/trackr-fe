'use client';

import { ReactElement, useState } from 'react';
import Image from 'next/image';
import { Alert, Button, Flex, Form, Input } from 'antd';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import google from '@/assets/google.png';
import github from '@/assets/github.svg';
import Text from 'antd/es/typography/Text';
import { FormEnum } from '@/constants';
import { z } from 'zod';
import { createSchemaFieldRule } from 'antd-zod';

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z.string(),
});

const rule = createSchemaFieldRule(registerSchema);

export default function LoginForm(): ReactElement<void> {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      setIsLogging(true);
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (!res?.error) {
        window.location.href = callbackUrl;
        if (invalidCredentials) {
          setInvalidCredentials(false);
        }
      } else {
        setInvalidCredentials(true);
      }
    } catch (error: unknown) {
      console.error(error as string);
    }
    setIsLogging(false);
  };

  const onFinishFailed = () => console.error('Finish failed');

  const handleSignup = async (): Promise<void> => {
    const params = new URLSearchParams();
    params.set('form', FormEnum.signUp);
    push(`${pathname}?${params.toString()}`);
  };

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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {invalidCredentials && (
            <Form.Item>
              <Alert
                message="Invalid email or password"
                type="error"
                showIcon
              />
            </Form.Item>
          )}
          <Form.Item name="email" rules={[rule]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[rule]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item label={null}>
            <Flex gap="0.725rem" vertical>
              <Button
                type="primary"
                style={{ width: '100%' }}
                htmlType="submit"
                loading={isLogging}
                iconPosition="end"
              >
                Login
              </Button>
              <Button
                type="default"
                style={{ width: '100%' }}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
}
