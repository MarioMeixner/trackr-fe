'use server';

import type { components } from '@/lib/api';
import { client } from './clientBase';
import { getApiHeaders } from './apiHeaders';

const fetchTracks = async (): Promise<
  Array<components['schemas']['TrackEntity']> | undefined
> => {
  try {
    const headers = await getApiHeaders();
    const { data } = await client.GET('/tracks', { headers });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const fetchTrack = async (
  id: string
): Promise<components['schemas']['TrackEntity'] | undefined> => {
  try {
    const headers = await getApiHeaders();
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

export { fetchTracks, fetchTrack };
