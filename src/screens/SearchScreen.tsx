import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useSongs } from "../hooks/useSongs";
import { setCurrentSong, Song } from "../store/slices/playerSlice";
import { audioService } from "../services/AudioService";

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { saavnApi } = require("../services/saavnApi");
      const response = await saavnApi.get(
        `/search/songs?query=${encodeURIComponent(query.trim())}&limit=20`
      );
      
      const results = response.data?.data?.results || [];
      
      const formattedResults = await Promise.all(
        results.map(async (item: any) => {
          try {
            const details = await saavnApi.get(`/songs/${item.id}`);
            const songData = details.data?.data?.[0];
            const audio = songData?.downloadUrl?.find(
              (d: any) => d.quality === "320kbps"
            )?.url || "";
            
            return {
              id: item.id,
              title: item.name,
              artist: item.primaryArtists || "Unknown Artist",
              duration: formatDuration(item.duration),
              image: {
                uri: item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || "",
              },
              audio,
            };
          } catch (err) {
            return null;
          }
        })
      );
      
      setSearchResults(formattedResults.filter(Boolean));
    } catch (error) {
      console.log("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlaySong = (song: any) => {
    dispatch(setCurrentSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
      audio: song.audio,
    }));
    navigation.navigate("PlayerScreen");
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable style={styles.songRow} onPress={() => handlePlaySong(item)}>
      <Image source={item.image} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text numberOfLines={1} style={styles.songTitle}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </Pressable>
  );

  const renderEmpty = () => {
    if (isSearching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }
    
    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search" size={48} color="#ddd" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>Try a different search term</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="search" size={48} color="#ddd" />
        <Text style={styles.emptyTitle}>Search for songs</Text>
        <Text style={styles.emptySubtitle}>Find your favorite music</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#999"
            autoFocus
          />
          <Pressable style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 16,
    borderRadius: 22,
    justifyContent: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});
