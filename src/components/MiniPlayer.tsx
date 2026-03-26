import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../store";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { audioService } from "../services/AudioService";

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    position,
    duration,
  } = useAudioPlayer();

  const currentIndex = useSelector((state: RootState) => state.player.currentIndex);
  const queue = useSelector((state: RootState) => state.player.queue);

  if (!currentSong) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("PlayerScreen")}
    >
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      
      <Image source={currentSong.image} style={styles.image} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {currentSong.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {currentSong.artist}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={playPrevious} style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={20} color="white" />
        </Pressable>

        <Pressable onPress={togglePlayPause} style={styles.playBtn}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="white" />
        </Pressable>

        <Pressable onPress={playNext} style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={20} color="white" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    height: 64,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "#FFA500",
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlBtn: {
    padding: 4,
  },
  playBtn: {
    padding: 4,
  },
});
