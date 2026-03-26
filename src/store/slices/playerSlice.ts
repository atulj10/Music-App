// store/playerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  image: { uri: string };
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },

    playSong: (state) => {
      state.isPlaying = true;
    },

    pauseSong: (state) => {
      state.isPlaying = false;
    },
  },
});

export const {
  setCurrentSong,
  playSong,
  pauseSong,
} = playerSlice.actions;

export default playerSlice.reducer;