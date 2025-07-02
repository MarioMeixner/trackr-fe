'use server';

import type { components } from '@/lib/api';
import { client } from './clientBase';
import { getApiHeaders } from './apiHeaders';
import { revalidateTag } from 'next/cache';
import { getUsersId } from '@/utils/user';

type TrackEntity = components['schemas']['TrackEntity'];

const createTrack = async (
  track: components['schemas']['CreateTrackDto']
): Promise<void> => {
  try {
    const userId = await getUsersId();
    const { headers } = await getApiHeaders({});
    await client.POST('/tracks', {
      headers,
      body: { ...track, authorId: userId },
    });
    revalidateTag('tracks');
  } catch (error) {
    console.error(error);
  }
};

const fetchTracks = async (): Promise<Array<TrackEntity> | undefined> => {
  try {
    const userId = await getUsersId();
    const { headers, next } = await getApiHeaders({ tags: ['tracks'] });
    const { data } = await client.GET('/tracks', {
      headers,
      next,
      data: { id: userId },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchTrack = async (
  id: string
): Promise<components['schemas']['TrackEntity'] | undefined> => {
  try {
    const { headers } = await getApiHeaders({});
    const { data } = await client.GET('/tracks/{id}', {
      headers,
      params: {
        path: {
          id,
        },
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const updateTrack = async (
  id: string,
  track: components['schemas']['UpdateTrackDto']
): Promise<TrackEntity | undefined> => {
  try {
    const userId = await getUsersId();
    const { headers } = await getApiHeaders({});
    const { data } = await client.PATCH('/tracks/{id}', {
      headers,
      params: {
        path: {
          id,
        },
      },
      body: { ...track, authorId: userId },
    });
    revalidateTag('tracks');
    return data;
  } catch (error) {
    console.error(error);
  }
};

const deleteTrack = async (id: string): Promise<void> => {
  try {
    const { headers } = await getApiHeaders({});
    await client.DELETE('/tracks/{id}', {
      headers,
      params: { path: { id } },
    });
    revalidateTag('tracks');
  } catch (error) {
    console.error(error);
  }
};

export { createTrack, fetchTracks, fetchTrack, updateTrack, deleteTrack };
