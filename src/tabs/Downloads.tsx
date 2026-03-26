import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { downloadService, DownloadMetadata } from "../services/downloadService";
import { setCurrentSong, Song } from "../store/slices/playerSlice";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface DownloadedSong extends Song {
  localUri: string;
}

export default function Downloads() {
  const [downloads, setDownloads] = useState<DownloadMetadata[]>([]);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { playSong } = useAudioPlayer();

  const loadDownloads = useCallback(async () => {
    const songs = downloadService.getAllDownloadsWithMetadata();
    setDownloads(songs);
  }, []);

  useEffect(() => {
    loadDownloads();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadDownloads();
    });

    return unsubscribe;
  }, [loadDownloads, navigation]);

  const handlePlay = (song: DownloadMetadata) => {
    const localUri = downloadService.getLocalUri(song.id);
    if (localUri) {
      const songToPlay: Song = {
        ...song,
        audio: localUri,
      };
      dispatch(setCurrentSong(songToPlay));
    }
  };

  const handleDelete = (songId: string) => {
    Alert.alert(
      "Delete Download",
      "Remove this song from offline storage?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await downloadService.deleteSong(songId);
            loadDownloads();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DownloadMetadata }) => (
    <Pressable style={styles.songItem} onPress={() => handlePlay(item)}>
      <View style={styles.songImage}>
        {item.image?.uri ? (
          <Image source={{ uri: item.image.uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="musical-note" size={24} color="#666" />
          </View>
        )}
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist || "Downloaded"}
        </Text>
      </View>
      <Pressable 
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF4444" />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Downloads</Text>
        <Text style={styles.headerSubtitle}>
          {downloads.length} offline song{downloads.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="download-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No downloads yet</Text>
          <Text style={styles.emptySubtext}>
            Download songs from the player to listen offline
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  list: {
    paddingBottom: 160,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  songArtist: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});
