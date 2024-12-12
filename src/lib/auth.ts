import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
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
    // CredentialsProvider({}), // Include a Credentials provider (username/password)
  ],
};
