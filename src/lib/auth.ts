import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { prisma } from './prisma';

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
        const response = await sql`
          SELECT * FROM "User" WHERE "email"=${credentials?.email}
        `;
        const user = response.rows[0];

        if (!user) {
          console.error('No user found with this email');
          return null;
        }

        const passwordCorrect = await bcrypt.compare(
          credentials?.password || '',
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        } else {
          console.error('Invalid password');
          return null;
        }
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
