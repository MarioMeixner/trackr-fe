import { getToken } from 'next-auth/jwt';

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/protected-route/:path*',
    '/dashboard/:path*',
    '/timer/:path*',
  ],
};
