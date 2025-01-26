import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { login } from '@/api/authApi';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error('Invalid password or email!');
          return null;
        }

        const { email, password } = credentials;
        try {
          const response = await login({
            email: email,
            password: password,
          });
          if (response) {
            cookies().set('access_token', response.accessToken);
            return {
              id: response.accessToken,
              email: credentials?.email,
            };
          }
        } catch (error) {
          console.error('Login failed', error);
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile?.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: profile?.email as string,
                name: profile?.name ?? '',
              },
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      session.user = token as JWT;
      return session;
    },
  },
};
