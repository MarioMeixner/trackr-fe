'use server';

import { cookies } from 'next/headers';

export const getApiHeaders = async ({
  tags = [],
  revalidate = 3600,
  extraHeaders,
}: {
  tags?: string[];
  revalidate?: number;
  extraHeaders?: Record<string, string>;
}) => {
  return {
    headers: {
      Cookie: cookies().toString(),
      ...extraHeaders,
    },
    next: {
      revalidate,
      tags,
    },
  };
};
