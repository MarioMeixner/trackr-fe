'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTrack(formData: string) {
  const data = JSON.parse(formData);
  await prisma.track?.create({
    data: {
      title: data.title as string,
      duration: data.duration as string,
      author: {
        connect: {
          email: 'mario@trackr.com',
        },
      },
    },
  });
  revalidatePath('/timer');
  redirect('/timer');
}

export async function editTrack(formData: FormData, id: string) {
  await prisma.track?.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      duration: formData.get('duration') as string,
      author: {
        connect: {
          email: 'mario@trackr.com',
        },
      },
    },
  });
  revalidatePath('/timer');
  redirect('/timer');
}

export async function deleteTrack(id: string) {
  await prisma.track?.delete({ where: { id } });
  revalidatePath('/timer');
  redirect('/timer');
}
