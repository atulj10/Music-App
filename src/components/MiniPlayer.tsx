import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigation } from "@react-navigation/native";

export default function MiniPlayer() {
  const navigation = useNavigation();

  const song = useSelector(
    (state: RootState) => state.player.currentSong
  );

  if (!song) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("PlayerScreen")}
    >
      <Image source={song.image} style={styles.image} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {song.title}
        </Text>

        <Text numberOfLines={1} style={styles.artist}>
          {song.artist}
        </Text>
      </View>

      <Text style={styles.icon}>⏸</Text>
      <Text style={styles.icon}>⏭</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 60, // sits above tab bar
    left: 10,
    right: 10,

    height: 64,

    backgroundColor: "#2a2a2a",
    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    elevation: 8,
  },

  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    color: "white",
    fontWeight: "600",
  },

  artist: {
    color: "#aaa",
    fontSize: 12,
  },

  icon: {
    color: "white",
    fontSize: 18,
    marginLeft: 16,
  },
});