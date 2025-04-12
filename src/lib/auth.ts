import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { login, refreshToken } from '@/api/authApi';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

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
    async signIn() {
      // if (account?.provider === 'google' || account?.provider === 'github') {
      //   try {
      //     const existingUser = await prisma.user.findUnique({
      //       where: { email: profile?.email },
      //     });

      //     if (!existingUser) {
      //       await prisma.user.create({
      //         data: {
      //           email: profile?.email as string,
      //           name: profile?.name ?? '',
      //         },
      //       });
      //     }
      //   } catch (error) {
      //     console.error('Error in signIn callback:', error);
      //     return true;
      //   }
      // }
      return true;
    },
    async jwt({ token, user }) {
      const accessToken = cookies().get('access_token')?.value as string;
      const decodedAccessToken = jwtDecode(accessToken);

      if (
        decodedAccessToken?.exp &&
        Math.floor(Date.now() / 1000) >= decodedAccessToken.exp
      ) {
        await refreshToken();
      }

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
