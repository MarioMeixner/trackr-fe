import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Track } from '@/types';

type TrackState = {
  track: Track;
  isEditing: boolean;
};

const initState: TrackState = {
  track: {
    id: '',
    title: '',
    date: undefined,
    duration: '',
    description: '',
  },
  isEditing: false,
};

export const trackerSlice = createSlice({
  name: 'trakcer',
  initialState: initState,
  reducers: {
    setTrackToEdit: (state, { payload }: PayloadAction<Track>) => {
      Object.assign(state.track, payload);
    },
    setIsEditing: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditing = payload;
    },
    resetTrackToEdit: (state) => {
      Object.assign(state, initState);
    },
  },
});

export const { setTrackToEdit, setIsEditing, resetTrackToEdit } =
  trackerSlice.actions;

export const selectTracker = (state: RootState) => state.tracker;

export default trackerSlice.reducer;
