import React, { useEffect } from "react";

import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import Slider from "@react-native-community/slider";

import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../store";

import {
  setPosition,
  setDuration,
  playNext,
  playPrevious,
  play,
  pause,
} from "../store/slices/playerSlice";

import { audioService } from "../services/AudioService";

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);

  const mins = Math.floor(totalSeconds / 60);

  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function PlayerScreen() {
  const dispatch = useDispatch();

  const song = useSelector((state: RootState) => state.player.currentSong);

  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);

  const position = useSelector((state: RootState) => state.player.position);

  const duration = useSelector((state: RootState) => state.player.duration);

  const queue = useSelector((state: RootState) => state.player.queue);

  const currentIndex = useSelector(
    (state: RootState) => state.player.currentIndex,
  );

  /*
  PROGRESS LISTENER
  */

  useEffect(() => {
    let handledFinish = false;

    const callback = async (status: any) => {
      dispatch(setPosition(status.positionMillis));

      dispatch(setDuration(status.durationMillis));

      const isFinished =
        status.durationMillis > 0 &&
        status.positionMillis >= status.durationMillis - 500;

      if (isFinished && !handledFinish) {
        handledFinish = true;

        const hasNext = currentIndex < queue.length - 1;

        if (hasNext) {
          dispatch(playNext());
        } else {
          // repeat current

          await audioService.seekTo(0);

          await audioService.resume();

          dispatch(play());
        }

        setTimeout(() => {
          handledFinish = false;
        }, 1000);
      }
    };

    audioService.addProgressListener(callback);

    return () => audioService.removeProgressListener(callback);
  }, [currentIndex, queue.length]);

  /*
  PLAY WHEN SONG CHANGES
  */

  useEffect(() => {
    if (!song?.audio) return;

    const currentUri = audioService.getCurrentUri();

    if (currentUri !== song.audio) {
      audioService.play(song.audio);

      dispatch(play());
    }
  }, [song?.id]);
  /*
  CONTROLS
  */

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioService.pause();

      dispatch(pause());
    } else {
      await audioService.resume();

      dispatch(play());
    }
  };

  const handleSeek = async (value: number) => {
    await audioService.seekTo(value);

    dispatch(setPosition(value));
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  const handleBackward = () => {
    audioService.seekBackward(10);
  };

  const handleForward = () => {
    audioService.seekForward(10);
  };

  if (!song) {
    return (
      <View style={styles.center}>
        <Text>No song selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={song.image} style={styles.image} />

      <Text style={styles.title}>{song.title}</Text>

      <Text style={styles.artist}>{song.artist}</Text>

      {/* PROGRESS */}

      <View style={styles.progressContainer}>
        <Slider
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onValueChange={(value) => dispatch(setPosition(value))}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#FFA500"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#FFA500"
        />

        <View style={styles.timeRow}>
          <Text>{formatTime(position)}</Text>

          <Text>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* CONTROLS */}

      <View style={styles.controls}>
        <Pressable onPress={handlePrevious}>
          <Ionicons name="play-skip-back" size={28} />
        </Pressable>

        <Pressable onPress={handleBackward}>
          <MaterialIcons name="replay-10" size={28} />
        </Pressable>

        <Pressable style={styles.playBtn} onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={34}
            color="#fff"
          />
        </Pressable>

        <Pressable onPress={handleForward}>
          <MaterialIcons name="forward-10" size={28} />
        </Pressable>

        <Pressable onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={28} />
        </Pressable>
      </View>

      {/* QUEUE INFO */}

      <Text style={styles.queue}>
        {currentIndex + 1} / {queue.length} songs
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 280,
    height: 280,
    borderRadius: 24,
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  artist: {
    color: "#666",
    marginTop: 6,
  },

  progressContainer: {
    width: "100%",
    marginTop: 24,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 28,
  },

  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
  },

  queue: {
    marginTop: 20,
    color: "#666",
  },
});
