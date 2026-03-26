import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;

  image: {
    uri: string;
  };

  audio: string;
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
    setCurrentSong: (
      state,
      action: PayloadAction<Song>
    ) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },

    play: (state) => {
      state.isPlaying = true;
    },

    pause: (state) => {
      state.isPlaying = false;
    },
  },
});

export const {
  setCurrentSong,
  play,
  pause,
} = playerSlice.actions;

export default playerSlice.reducer;