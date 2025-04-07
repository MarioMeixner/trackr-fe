'use server';

import { cookies } from 'next/headers';
import { client } from './clientBase';
import { components } from '@/lib/api';
import { getApiHeaders } from './apiHeaders';

type AuthEntity = components['schemas']['AuthEntity'];

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthEntity | undefined> => {
  const { data } = await client.POST('/auth/login', {
    body: {
      email,
      password,
    },
  });
  if (data?.accessToken && data?.refreshToken) {
    const cookieStore = cookies();
    cookieStore.set('access_token', data.accessToken, { httpOnly: true });
    cookieStore.set('refresh_token', data.refreshToken, { httpOnly: true });
  }
  return data;
};

const refreshToken = async (): Promise<AuthEntity | undefined> => {
  const { headers } = await getApiHeaders({});
  const { data } = await client.POST('/auth/refresh', { headers });
  if (data?.accessToken && data?.refreshToken) {
    const cookieStore = cookies();
    cookieStore.set('access_token', data.accessToken, { httpOnly: true });
    cookieStore.set('refresh_token', data.refreshToken, { httpOnly: true });
  }
  return data;
};

const logout = async (): Promise<void> => {
  const { headers } = await getApiHeaders({});
  await client.POST('/auth/signout', { headers });
  const cookieStore = cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
};

const register = async ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthEntity | undefined> => {
  const { data } = await client.POST('/auth/register', {
    body: {
      email,
      name,
      password,
    },
  });
  return data;
};

export { login, refreshToken, logout, register };
