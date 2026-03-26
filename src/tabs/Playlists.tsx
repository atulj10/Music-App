import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  removeFromQueue,
  reorderQueue,
  playFromQueue,
  clearQueue,
  Song,
} from "../store/slices/playerSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_STORAGE_KEY = "@music_player_queue";

export default function QueueScreen() {
  const dispatch = useDispatch();
  const queue = useSelector((state: RootState) => state.player.queue);
  const currentIndex = useSelector((state: RootState) => state.player.currentIndex);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    saveQueueToStorage(queue);
  }, [queue]);

  const saveQueueToStorage = async (queueToSave: Song[]) => {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queueToSave));
    } catch (error) {
      console.log("Error saving queue:", error);
    }
  };

  const loadQueueFromStorage = async () => {
    try {
      const savedQueue = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        return JSON.parse(savedQueue);
      }
    } catch (error) {
      console.log("Error loading queue:", error);
    }
    return [];
  };

  const handleRemoveFromQueue = (index: number) => {
    Alert.alert(
      "Remove from Queue",
      "Are you sure you want to remove this song?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeFromQueue(index)),
        },
      ]
    );
  };

  const handleClearQueue = () => {
    Alert.alert(
      "Clear Queue",
      "Are you sure you want to clear the entire queue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => dispatch(clearQueue()),
        },
      ]
    );
  };

  const handlePlaySong = (index: number) => {
    dispatch(playFromQueue(index));
  };

  const renderItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentlyPlaying = index === currentIndex;

    return (
      <View style={[styles.songItem, isCurrentlyPlaying && styles.activeItem]}>
        <Pressable style={styles.songInfo} onPress={() => handlePlaySong(index)}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[styles.songTitle, isCurrentlyPlaying && styles.activeText]}
            >
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {item.artist}
            </Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          {isCurrentlyPlaying && (
            <View style={styles.playingIndicator}>
              <Ionicons name="musical-note" size={16} color="#FFA500" />
            </View>
          )}

          {isEditMode && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => handleRemoveFromQueue(index)}
            >
              <Ionicons name="close" size={18} color="#FF3B30" />
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Up Next</Text>
        <Text style={styles.headerSubtitle}>{queue.length} songs</Text>
      </View>

      <View style={styles.headerActions}>
        {queue.length > 0 && (
          <>
            <Pressable
              style={[styles.editBtn, isEditMode && styles.editBtnActive]}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Text style={[styles.editText, isEditMode && styles.editTextActive]}>
                {isEditMode ? "Done" : "Edit"}
              </Text>
            </Pressable>

            <Pressable style={styles.clearBtn} onPress={handleClearQueue}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="musical-notes" size={48} color="#ddd" />
      <Text style={styles.emptyTitle}>Your queue is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add songs from the home screen to start playing
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Queue</Text>
      </View>

      <FlatList
        data={queue}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerInfo: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  editBtnActive: {
    backgroundColor: "#FFA500",
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  editTextActive: {
    color: "#fff",
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF3B30",
  },
  listContent: {
    paddingBottom: 150,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  activeItem: {
    backgroundColor: "#FFF8E7",
  },
  songInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFA500",
  },
  artist: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playingIndicator: {
    marginRight: 8,
  },
  playingIcon: {
    fontSize: 16,
  },
  removeBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
