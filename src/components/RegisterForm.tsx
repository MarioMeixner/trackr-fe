'use client';

import { ReactElement, useState } from 'react';
import { Alert, Button, Flex, Form, Input } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { FormEnum } from '@/constants';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { createSchemaFieldRule } from 'antd-zod';
import { register } from '@/api/authApi';

const registerSchema = z
  .object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })
  .refine(({ password }) => password.length > 5, {
    message: 'Password must have at least 6 characters',
    path: ['password'],
  });

const rule = createSchemaFieldRule(registerSchema);

export default function RegisterForm(): ReactElement<void> {
  const pathname = usePathname();
  const { push } = useRouter();
  const [isSigning, setIsSigning] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const onSubmit = async (values: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }): Promise<void> => {
    const { name, surname, email, password } = values;
    const fullname = name + ' ' + surname;
    setIsSigning(true);
    try {
      const response = await register({ email, name: fullname, password });

      if (response) {
        console.log(response.user);
        const res = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
        });
        if (!res?.error) {
          push('/');
          if (invalidCredentials) {
            setInvalidCredentials(false);
          }
        } else {
          setInvalidCredentials(true);
        }
      }
    } catch (error: unknown) {
      console.error(error as string);
    }
    setIsSigning(false);
  };

  const onFinishFailed = () => console.error('Finish failed');

  const handleLogin = (): void => {
    const params = new URLSearchParams();
    params.set('form', FormEnum.login);
    push(`${pathname}?${params.toString()}`);
  };

  return (
    <Flex>
      <Flex vertical style={{ width: '16rem' }}>
        <Form
          name="basic"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {invalidCredentials && (
            <Form.Item>
              <Alert
                message="A user with that email address already exists"
                type="error"
                showIcon
              />
            </Form.Item>
          )}
          <Form.Item name="name" rules={[rule]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="surname" rules={[rule]}>
            <Input placeholder="Surname" />
          </Form.Item>
          <Form.Item name="email" rules={[rule]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[rule]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[rule]}>
            <Input.Password placeholder="Repeat password" />
          </Form.Item>
          <Form.Item label={null}>
            <Flex gap="0.725rem" vertical>
              <Button
                type="primary"
                style={{ width: '100%' }}
                htmlType="submit"
                loading={isSigning}
                iconPosition="end"
              >
                Sign up
              </Button>
              <Button
                type="default"
                style={{ width: '100%' }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Flex>
    </Flex>
  );
}
