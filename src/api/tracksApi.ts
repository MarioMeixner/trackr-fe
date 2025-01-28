'use server';

import { apiConfig } from './configuration';
import { TracksApi } from './generated-api/apis';
import { TrackEntity } from './generated-api/models';

const tracksApi = new TracksApi(apiConfig());

const fetchTracks = async (): Promise<Array<TrackEntity>> => {
  try {
    const data = await tracksApi.tracksControllerFindAll();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
const fetchTrack = async (id: string): Promise<TrackEntity> => {
  return await tracksApi.tracksControllerFindOne({ id });
};

export { fetchTracks, fetchTrack };
