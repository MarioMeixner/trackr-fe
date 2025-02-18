'use server';

import { cookies } from 'next/headers';
import { client } from './clientBase';
import { components } from '@/lib/api';
import { getApiHeaders } from './apiHeaders';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<components['schemas']['AuthEntity'] | undefined> => {
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

export const refreshToken = async (): Promise<
  components['schemas']['AuthEntity'] | undefined
> => {
  const headers = await getApiHeaders();
  const { data } = await client.POST('/auth/refresh', { headers });
  if (data?.accessToken && data?.refreshToken) {
    const cookieStore = cookies();
    cookieStore.set('access_token', data.accessToken, { httpOnly: true });
    cookieStore.set('refresh_token', data.refreshToken, { httpOnly: true });
  }
  return data;
};

export const logout = async (): Promise<void> => {
  const headers = await getApiHeaders();
  await client.POST('/auth/signout', { headers });
  const cookieStore = cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
};
