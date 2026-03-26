import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const PlayerScreen = () => {
  const song = useSelector(
    (state: RootState) => state.player.currentSong
  );

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

      <Text style={styles.title}>
        {song.title}
      </Text>

      <Text style={styles.artist}>
        {song.artist}
      </Text>
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
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});
