import { Configuration } from './generated-api';
import { cookies } from 'next/headers';

export const apiConfig = () => {
  const token = cookies().get('access_token')?.value;

  if (!token) {
    throw new Error('Access token not available');
  }
  return new Configuration({
    basePath: process.env.TRACKR_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    middleware: [],
  });
};

export const unauthorizedApiConfig = () => {
  return new Configuration({
    basePath: process.env.TRACKR_API_URL,
    middleware: [],
  });
};
