import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import {
  setCurrentSong,
  play,
  pause,
} from "../store/slices/playerSlice";

import { audioService } from "../services/AudioService";

export function useAudioPlayer() {
  const dispatch = useDispatch();

  const { currentSong, isPlaying } =
    useSelector((state: RootState) => state.player);

  const playSong = async (song: any) => {
    if (!song.audio) {
      console.log("No audio URL");
      return;
    }

    await audioService.play(song.audio);

    dispatch(setCurrentSong(song));
  };

  const togglePlayPause = async () => {
    if (!currentSong) return;

    if (isPlaying) {
      await audioService.pause();
      dispatch(pause());
    } else {
      await audioService.resume();
      dispatch(play());
    }
  };

  return {
    playSong,
    togglePlayPause,
    currentSong,
    isPlaying,
  };
}