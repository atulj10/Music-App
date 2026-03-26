import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setCurrentSong,
  setPosition,
  setDuration,
  play,
  pause,
  playNext as playNextAction,
  playPrevious as playPreviousAction,
  Song,
} from "../store/slices/playerSlice";
import { audioService } from "../services/AudioService";

export function useAudioPlayer() {
  const dispatch = useDispatch();

  const {
    queue,
    currentSong,
    isPlaying,
    position,
    duration,
    currentIndex,
  } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    const callback = (status: {
      isPlaying: boolean;
      positionMillis: number;
      durationMillis: number;
      didJustFinish: boolean;
    }) => {
      dispatch(setPosition(status.positionMillis));
      dispatch(setDuration(status.durationMillis));

      if (status.didJustFinish) {
        if (currentIndex < queue.length - 1) {
          dispatch(playNextAction());
        }
      }
    };

    audioService.addProgressListener(callback);

    return () => {
      audioService.removeProgressListener(callback);
    };
  }, [dispatch, currentIndex, queue.length]);

  const playSong = useCallback(async (song: Song) => {
    dispatch(setCurrentSong(song));
  }, [dispatch]);

  const togglePlayPause = useCallback(async () => {
    if (!currentSong) return;

    if (isPlaying) {
      await audioService.pause();
      dispatch(pause());
    } else {
      await audioService.resume();
      dispatch(play());
    }
  }, [currentSong, isPlaying, dispatch]);

  const seek = useCallback(async (value: number) => {
    await audioService.seekTo(value);
    dispatch(setPosition(value));
  }, [dispatch]);

  const playNext = useCallback(async () => {
    if (currentIndex < queue.length - 1) {
      dispatch(playNextAction());
    }
  }, [currentIndex, queue.length, dispatch]);

  const playPrevious = useCallback(async () => {
    if (currentIndex > 0) {
      dispatch(playPreviousAction());
    }
  }, [currentIndex, dispatch]);

  useEffect(() => {
    if (currentSong?.audio) {
      audioService.play(currentSong.audio);
    }
  }, [currentSong?.id]);

  return {
    currentSong,
    isPlaying,
    position,
    duration,
    queue,
    currentIndex,
    playSong,
    togglePlayPause,
    seek,
    playNext,
    playPrevious,
  };
}
