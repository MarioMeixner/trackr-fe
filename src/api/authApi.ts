'use server';

import { unauthorizedApiConfig } from './configuration';
import { AuthApi, AuthEntity } from './generated-api';

const authApi = new AuthApi(unauthorizedApiConfig());

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthEntity> => {
  return await authApi.authControllerLogin({ loginDto: { email, password } });
};
