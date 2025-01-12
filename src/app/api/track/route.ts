import { today } from '@/constants';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { start, end } = today();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    const tracks = await prisma.track.findMany({
      where: {
        ...(searchParams.get('query') === 'today' && {
          date: { gte: start, lte: end },
        }),
        author: { email: userEmail as string },
      },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error adding todo:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;
    const body = await request.json();
    await prisma.track?.create({
      data: {
        title: body.title as string,
        duration: body.duration as string,
        author: {
          connect: {
            email: userEmail as string,
          },
        },
      },
    });

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error('Error adding todo:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }

    await prisma.track.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error adding todo:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
