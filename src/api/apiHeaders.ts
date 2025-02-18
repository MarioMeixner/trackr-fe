'use server';

import { cookies } from 'next/headers';

export const getApiHeaders = async (extraHeaders?: Record<string, string>) => {
  return {
    Cookie: cookies().toString(),
    ...extraHeaders,
  };
};
