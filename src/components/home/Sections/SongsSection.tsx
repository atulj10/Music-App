import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";

import VerticalList, { SongItem } from "../../VerticalList";
import SongOptionsSheet, {
  SongData,
  SongOptionsSheetRef,
} from "../SongsOptionsSheet";

import { useSongs } from "../../../hooks/useSongs";

const SongsSection = () => {
  const bottomSheetRef = useRef<SongOptionsSheetRef>(null);

  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);

  const { songs, loading, error } = useSongs("top hindi songs");

  const handlePlayPress = (song: SongItem) => {
    console.log("Play:", song.title);
  };

  const handleMorePress = (song: SongItem) => {
    setSelectedSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
    });

    bottomSheetRef.current?.open();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load songs</Text>

        <Pressable onPress={() => location.reload()}>
          <Text style={{ color: "orange" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.scrollContainer}> */}
      <View style={styles.header}>
        <Text style={styles.count}>{songs.length} songs</Text>

        <Pressable>
          <Text style={styles.sort}>Ascending ↑↓</Text>
        </Pressable>
      </View>

      <VerticalList
        data={songs}
        onMorePress={handleMorePress}
        onPlayPress={handlePlayPress}
      />
      {/* </ScrollView> */}
      <SongOptionsSheet ref={bottomSheetRef} song={selectedSong} />
    </View>
  );
};

export default SongsSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  scrollContainer: {
    flex: 1,
  },

  centerContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  count: {
    fontWeight: "700",
    fontSize: 16,
  },

  sort: {
    color: "orange",
    fontWeight: "700",
  },

  errorText: {
    color: "grey",
    marginBottom: 10,
  },
});
