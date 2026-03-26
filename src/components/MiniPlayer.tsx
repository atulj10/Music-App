import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useAudioPlayer } from "../hooks/useAudioPlayer";

export default function MiniPlayer() {
  const navigation = useNavigation();

  const {
    currentSong,
    isPlaying,
    togglePlayPause,
  } = useAudioPlayer();

  if (!currentSong) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("PlayerScreen")
      }
    >
      <Image
        source={currentSong.image}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1}>
          {currentSong.title}
        </Text>

        <Text numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      <Pressable onPress={togglePlayPause}>
        <Text style={styles.icon}>
          {isPlaying ? "⏸" : "▶"}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 60,
    left: 10,
    right: 10,

    height: 64,

    backgroundColor: "#2a2a2a",

    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },

  icon: {
    fontSize: 22,
    color: "white",
  },
});