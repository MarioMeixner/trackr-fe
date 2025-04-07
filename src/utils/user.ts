'use server';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import { cookies } from 'next/headers';

export const getUsersId = async (): Promise<string> => {
  const accessToken = cookies().get('access_token')?.value as string;
  const decodedAccessToken = (await jwtDecode(accessToken)) as JwtPayload & {
    userId?: string;
  };
  return decodedAccessToken?.userId || '';
};
