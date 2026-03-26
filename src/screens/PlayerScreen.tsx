import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../store";
import { setPosition, setDuration, playNext, playPrevious } from "../store/slices/playerSlice";
import Slider from "@react-native-community/slider";
import { audioService } from "../services/AudioService";

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PlayerScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const song = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  const position = useSelector((state: RootState) => state.player.position);
  const duration = useSelector((state: RootState) => state.player.duration);
  const queue = useSelector((state: RootState) => state.player.queue);
  const currentIndex = useSelector((state: RootState) => state.player.currentIndex);

  useEffect(() => {
    const callback = (status: {
      isPlaying: boolean;
      positionMillis: number;
      durationMillis: number;
      didJustFinish: boolean;
    }) => {
      dispatch(setPosition(status.positionMillis));
      dispatch(setDuration(status.durationMillis));
    };

    audioService.addProgressListener(callback);

    return () => {
      audioService.removeProgressListener(callback);
    };
  }, [dispatch]);

  useEffect(() => {
    if (song?.audio) {
      audioService.play(song.audio);
    }
  }, [song?.id]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioService.pause();
    } else {
      await audioService.resume();
    }
  };

  const handleSeek = async (value: number) => {
    await audioService.seekTo(value);
  };

  const handlePrevious = async () => {
    dispatch(playPrevious());
  };

  const handleNext = async () => {
    dispatch(playNext());
  };

  const handleSeekBackward = async () => {
    await audioService.seekBackward(10);
  };

  const handleSeekForward = async () => {
    await audioService.seekForward(10);
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

      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#FFA500"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#FFA500"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.secondaryBtn} onPress={handlePrevious}>
          <Text style={styles.controlIcon}>⏮</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleSeekBackward}>
          <Text style={styles.skipText}>-10</Text>
        </Pressable>

        <Pressable style={styles.playBtn} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleSeekForward}>
          <Text style={styles.skipText}>+10</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={handleNext}>
          <Text style={styles.controlIcon}>⏭</Text>
        </Pressable>
      </View>

      <View style={styles.queueInfo}>
        <Text style={styles.queueText}>
          {currentIndex + 1} / {queue.length} songs
        </Text>
        <Pressable 
          style={styles.queueBtn}
          onPress={() => navigation.navigate("Main", { screen: "Queue" })}
        >
          <Text style={styles.queueBtnText}>View Queue</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  progressContainer: {
    width: "100%",
    marginTop: 30,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 28,
    color: "#fff",
  },
  secondaryBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  controlIcon: {
    fontSize: 20,
    color: "#333",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  queueInfo: {
    marginTop: 20,
    alignItems: "center",
    gap: 12,
  },
  queueText: {
    color: "#666",
    fontSize: 14,
  },
  queueBtn: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  queueBtnText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
});
