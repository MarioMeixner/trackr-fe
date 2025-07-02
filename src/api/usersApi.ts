'use server';

import { components } from '@/lib/api';
import { getApiHeaders } from './apiHeaders';
import { client } from './clientBase';

type UserEntity = components['schemas']['UserEntity'];

const fetchUsers = async (): Promise<Array<UserEntity> | undefined> => {
  try {
    const { headers, next } = await getApiHeaders({ tags: ['users'] });
    const { data } = await client.GET('/users', { headers, next });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchUser = async (id: string): Promise<UserEntity | undefined> => {
  try {
    const { headers } = await getApiHeaders({});
    const { data } = await client.GET('/users/{id}', {
      headers,
      params: { path: { id } },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export { fetchUsers, fetchUser };
