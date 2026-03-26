import React, { useEffect, useState } from "react";

import { View, Text, Image, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";

import Slider from "@react-native-community/slider";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../store";

import {
  setPosition,
  setDuration,
  playNext,
  playPrevious,
  play,
  pause,
  toggleShuffle,
  cycleRepeatMode,
} from "../store/slices/playerSlice";

import { audioService } from "../services/AudioService";
import { downloadService } from "../services/downloadService";

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

  const repeatMode = useSelector((state: RootState) => state.player.repeatMode);

  const shuffleEnabled = useSelector(
    (state: RootState) => state.player.shuffleEnabled,
  );

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

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

        if (repeatMode === "one") {
          await audioService.seekTo(0);

          await audioService.resume();
        } else {
          dispatch(playNext());
        }

        setTimeout(() => {
          handledFinish = false;
        }, 1000);
      }
    };

    audioService.addProgressListener(callback);

    return () => audioService.removeProgressListener(callback);
  }, [currentIndex, queue.length, repeatMode]);

  /*
  PLAY WHEN SONG CHANGES
  */

  useEffect(() => {
    if (!song?.audio) return;

    const currentUri = audioService.getCurrentUri();

    if (currentUri !== song.audio) {
      audioService.play(song.id, song.audio);

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

  const handleForward = () => {
    audioService.seekForward(10);
  };

  const handleBackward = () => {
    audioService.seekBackward(10);
  };

  useEffect(() => {
    if (song?.id) {
      setIsDownloaded(downloadService.isDownloaded(song.id));
    }
  }, [song?.id]);

  const handleDownload = async () => {
    if (!song?.audio) return;

    if (isDownloaded) {
      Alert.alert(
        "Delete Download",
        "Remove offline version of this song?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await downloadService.deleteSong(song.id);
              setIsDownloaded(false);
            },
          },
        ]
      );
      return;
    }

    setIsDownloading(true);
    const localUri = await downloadService.downloadSong(song.id, song.audio, {
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
    });
    setIsDownloading(false);
    if (localUri) {
      setIsDownloaded(true);
    }
  };

  if (!song)
    return (
      <View style={styles.center}>
        <Text>No song selected</Text>
      </View>
    );

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
        {/* SHUFFLE */}

        <Pressable onPress={() => dispatch(toggleShuffle())}>
          <MaterialIcons
            name="shuffle"
            size={26}
            color={shuffleEnabled ? "#FFA500" : "#666"}
          />
        </Pressable>

        {/* PREVIOUS */}

        <Pressable onPress={() => dispatch(playPrevious())}>
          <Ionicons name="play-skip-back" size={28} />
        </Pressable>

        {/* -10 */}

        <Pressable onPress={handleBackward}>
          <MaterialIcons name="replay-10" size={28} />
        </Pressable>

        {/* PLAY */}

        <Pressable style={styles.playBtn} onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={34}
            color="#fff"
          />
        </Pressable>

        {/* +10 */}

        <Pressable onPress={handleForward}>
          <MaterialIcons name="forward-10" size={28} />
        </Pressable>

        {/* NEXT */}

        <Pressable onPress={() => dispatch(playNext())}>
          <Ionicons name="play-skip-forward" size={28} />
        </Pressable>

        {/* REPEAT */}

        <Pressable onPress={() => dispatch(cycleRepeatMode())}>
          <MaterialIcons
            name={repeatMode === "one" ? "repeat-one" : "repeat"}
            size={26}
            color={repeatMode === "off" ? "#666" : "#FFA500"}
          />
        </Pressable>
      </View>

      {/* DOWNLOAD BUTTON */}

      <Pressable 
        style={styles.downloadBtn} 
        onPress={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator size="small" color="#FFA500" />
        ) : (
          <Ionicons
            name={isDownloaded ? "checkmark-circle" : "download-outline"}
            size={24}
            color={isDownloaded ? "#4CAF50" : "#FFA500"}
          />
        )}
      </Pressable>

      {/* QUEUE INFO */}

      <Text style={styles.queue}>
        {currentIndex + 1} / {queue.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 20,
    marginTop: 28,
    flexWrap: "wrap",
    justifyContent: "center",
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

  downloadBtn: {
    marginTop: 16,
    padding: 12,
  },
});
