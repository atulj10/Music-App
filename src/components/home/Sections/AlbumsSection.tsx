import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import SongOptionsSheet, {
  SongData,
  SongOptionsSheetRef,
} from "../SongsOptionsSheet";

import { useAlbums, Album } from "../../../hooks/useAlbums";

const AlbumsSection = () => {
  const bottomSheetRef = useRef<SongOptionsSheetRef>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SongData | null>(null);

  const { albums, loading, error } = useAlbums("popular albums");

  const handleAlbumPress = (album: Album) => {
    console.log("Album pressed:", album.title);
  };

  const handleMorePress = (album: Album) => {
    setSelectedAlbum({
      id: album.id,
      title: album.title,
      artist: album.artist || "Unknown Artist",
      image: { uri: album.image.url },
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
        <Text style={styles.errorText}>Failed to load albums</Text>
        <Pressable onPress={() => location.reload()}>
          <Text style={{ color: "orange" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>{albums.length} albums</Text>
        <Pressable>
          <Text style={styles.sort}>Ascending ↑↓</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {albums.map((album) => (
            <Pressable
              key={album.id}
              style={styles.albumCard}
              onPress={() => handleAlbumPress(album)}
            >
              <Image
                source={{ uri: album.image.url }}
                style={styles.albumImage}
              />
              <View style={styles.titleRow}>
                <Text style={styles.albumName} numberOfLines={1}>
                  {album.title || "Unknown"}
                </Text>
                <Pressable
                  style={styles.moreButton}
                  onPress={() => handleMorePress(album)}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color="#444" />
                </Pressable>
              </View>
              <Text style={styles.albumMeta} numberOfLines={1}>
                {album.artist || "Unknown Artist"} | {album.year || "Unknown"}
              </Text>
              <Text style={styles.albumMeta}>
                {album.songsCount || "0"} songs
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <SongOptionsSheet ref={bottomSheetRef} song={selectedAlbum} />
    </View>
  );
};

export default AlbumsSection;

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
    marginBottom: 15,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 100,
  },
  albumCard: {
    width: "48%",
    marginBottom: 20,
    position: "relative",
  },
  albumImage: {
    width: "100%",
    height: Dimensions.get("screen").width * 0.45,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  albumName: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  albumMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  moreButton: {},
});
