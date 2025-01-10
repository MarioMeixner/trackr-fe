import { prisma } from '@/lib/prisma';
import { sql } from '@vercel/postgres';
import { hash } from 'bcrypt';
import { signIn } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const response = await sql`
      SELECT * FROM "User" WHERE "email"=${email}
    `;
    if (response.rows.length > 0) {
      throw Error();
    }
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    if (user) {
      signIn();
    }
  } catch (e) {
    console.error({ e });
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: 'success' });
}
