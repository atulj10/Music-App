import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";

import SongOptionsSheet, {
  SongData,
  SongOptionsSheetRef,
} from "../SongsOptionsSheet";

import { useArtists, Artist } from "../../../hooks/useArtists";

const ArtistsSection = () => {
  const bottomSheetRef = useRef<SongOptionsSheetRef>(null);
  const [selectedArtist, setSelectedArtist] = useState<SongData | null>(null);

  const { artists, loading, error } = useArtists("popular artists");

  const handlePlayPress = (artist: Artist) => {
    console.log("Play artist:", artist.name);
  };

  const handleMorePress = (artist: Artist) => {
    setSelectedArtist({
      id: artist.id,
      title: artist.name,
      artist: artist.followerCount ? `${artist.followerCount} followers` : "Artist",
      image: { uri: artist.image.url },
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
        <Text style={styles.errorText}>Failed to load artists</Text>
        <Pressable onPress={() => location.reload()}>
          <Text style={{ color: "orange" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>{artists.length} artists</Text>
        <Pressable>
          <Text style={styles.sort}>Ascending ↑↓</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {artists.map((artist) => (
          <View key={artist.id} style={styles.row}>
            <Image
              source={{ uri: artist.image.url }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.title}>
                {artist.name}
              </Text>
              <Text numberOfLines={1} style={styles.artist}>
                {artist.followerCount ? `${artist.followerCount} followers` : "Artist"}
              </Text>
            </View>

            <Pressable style={styles.playBtn} onPress={() => handlePlayPress(artist)}>
              <Text style={styles.playIcon}>▶</Text>
            </Pressable>

            <Pressable style={styles.moreBtn} onPress={() => handleMorePress(artist)}>
              <Text style={styles.moreIcon}>⋮</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <SongOptionsSheet ref={bottomSheetRef} song={selectedArtist} />
    </View>
  );
};

export default ArtistsSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ddd",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  artist: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  playBtn: {
    marginHorizontal: 10,
  },
  playIcon: {
    fontSize: 18,
    color: "orange",
  },
  moreBtn: {
    paddingHorizontal: 6,
  },
  moreIcon: {
    fontSize: 18,
    color: "#444",
  },
});
