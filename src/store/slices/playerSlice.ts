import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: { uri: string };
  audio: string;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  position: number;
  duration: number;

  repeatMode: "off" | "one" | "all";
  shuffleEnabled: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  position: 0,
  duration: 0,

  repeatMode: "off",
  shuffleEnabled: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,

  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      const existingIndex = state.queue.findIndex(
        (s) => s.id === action.payload.id,
      );

      if (existingIndex !== -1) {
        state.currentIndex = existingIndex;
      } else {
        state.queue = [action.payload];
        state.currentIndex = 0;
      }

      state.currentSong = action.payload;

      state.isPlaying = true;

      state.position = 0;
    },

    play: (state) => {
      state.isPlaying = true;
    },

    pause: (state) => {
      state.isPlaying = false;
    },

    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    /*
    QUEUE
    */

    addToQueue: (state, action: PayloadAction<Song>) => {
      const exists = state.queue.find((s) => s.id === action.payload.id);

      if (!exists) {
        state.queue.push(action.payload);
      }
    },

    addNextToPlay: (state, action: PayloadAction<Song>) => {
      const exists = state.queue.find((s) => s.id === action.payload.id);

      if (!exists) {
        const insertIndex =
          state.currentIndex >= 0 ? state.currentIndex + 1 : 0;

        state.queue.splice(insertIndex, 0, action.payload);

        if (insertIndex <= state.currentIndex) {
          state.currentIndex++;
        }
      }
    },

    removeFromQueue: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index >= 0 && index < state.queue.length) {
        state.queue.splice(index, 1);

        if (index < state.currentIndex) {
          state.currentIndex--;
        } else if (index === state.currentIndex) {
          if (state.queue.length > 0) {
            state.currentIndex = Math.min(
              state.currentIndex,
              state.queue.length - 1,
            );

            state.currentSong = state.queue[state.currentIndex];

            state.isPlaying = true;
          } else {
            state.currentIndex = -1;

            state.currentSong = null;

            state.isPlaying = false;
          }
        }
      }
    },

    reorderQueue: (
      state,
      action: PayloadAction<{
        fromIndex: number;
        toIndex: number;
      }>,
    ) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex >= 0 &&
        fromIndex < state.queue.length &&
        toIndex >= 0 &&
        toIndex < state.queue.length
      ) {
        const [removed] = state.queue.splice(fromIndex, 1);

        state.queue.splice(toIndex, 0, removed);

        if (state.currentIndex === fromIndex) {
          state.currentIndex = toIndex;
        }
      }
    },

    playFromQueue: (state, action: PayloadAction<number>) => {
      const index = action.payload;

      if (index >= 0 && index < state.queue.length) {
        state.currentIndex = index;

        state.currentSong = state.queue[index];

        state.isPlaying = true;

        state.position = 0;
      }
    },

    /*
    SHUFFLE
    */

    toggleShuffle: (state) => {
      state.shuffleEnabled = !state.shuffleEnabled;
    },

    /*
    REPEAT
    */

    cycleRepeatMode: (state) => {
      if (state.repeatMode === "off") {
        state.repeatMode = "all";
      } else if (state.repeatMode === "all") {
        state.repeatMode = "one";
      } else {
        state.repeatMode = "off";
      }
    },

    /*
    NEXT
    */

    playNext: (state) => {
      if (state.queue.length === 0) return;

      /*
      REPEAT ONE
      */

      if (state.repeatMode === "one") {
        return;
      }

      /*
      SHUFFLE
      */

      if (state.shuffleEnabled) {
        const randomIndex = Math.floor(Math.random() * state.queue.length);

        state.currentIndex = randomIndex;

        state.currentSong = state.queue[randomIndex];

        state.position = 0;

        return;
      }

      /*
      NORMAL
      */

      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex++;

        state.currentSong = state.queue[state.currentIndex];

        state.position = 0;
      } else if (state.repeatMode === "all") {

      /*
      REPEAT ALL
      */
        state.currentIndex = 0;

        state.currentSong = state.queue[0];

        state.position = 0;
      }
    },

    /*
    PREVIOUS
    */

    playPrevious: (state) => {
      if (state.queue.length === 0) return;

      if (state.shuffleEnabled) {
        const randomIndex = Math.floor(Math.random() * state.queue.length);

        state.currentIndex = randomIndex;

        state.currentSong = state.queue[randomIndex];

        state.position = 0;

        return;
      }

      if (state.currentIndex > 0) {
        state.currentIndex--;

        state.currentSong = state.queue[state.currentIndex];

        state.position = 0;
      } else if (state.repeatMode === "all") {
        state.currentIndex = state.queue.length - 1;

        state.currentSong = state.queue[state.currentIndex];

        state.position = 0;
      }
    },

    setQueue: (state, action: PayloadAction<Song[]>) => {
      state.queue = action.payload;

      if (action.payload.length > 0 && !state.currentSong) {
        state.currentIndex = 0;

        state.currentSong = action.payload[0];
      }
    },

    clearQueue: (state) => {
      state.queue = [];
      state.currentIndex = -1;
      state.currentSong = null;
      state.isPlaying = false;
      state.position = 0;
      state.duration = 0;
    },
  },
});

export const {
  setCurrentSong,
  play,
  pause,
  setPosition,
  setDuration,
  addToQueue,
  addNextToPlay,
  removeFromQueue,
  reorderQueue,
  playFromQueue,
  playNext,
  playPrevious,
  setQueue,
  clearQueue,

  toggleShuffle,
  cycleRepeatMode,
} = playerSlice.actions;

export default playerSlice.reducer;
