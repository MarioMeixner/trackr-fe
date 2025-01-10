/* eslint-disable @typescript-eslint/no-explicit-any */
import { Error as ErrorType } from '@/types';

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    const error: ErrorType = {
      message: res.statusText,
      status: res.status,
    };
    throw error;
  }

  return res.json() as Promise<T>;
};
