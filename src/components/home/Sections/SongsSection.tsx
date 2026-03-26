import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TextInput,
  FlatList,
  Image,
} from "react-native";

import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import SongOptionsSheet, {
  SongData,
  SongOptionsSheetRef,
} from "../SongsOptionsSheet";

import { useSongs } from "../../../hooks/useSongs";
import { setCurrentSong, addToQueue, addNextToPlay, Song } from "../../../store/slices/playerSlice";

const SongItemRow = ({ 
  item, 
  onPlay, 
  onMore, 
  isPlaying 
}: { 
  item: any; 
  onPlay: () => void; 
  onMore: () => void;
  isPlaying?: boolean;
}) => (
  <View style={[styles.songRow, isPlaying && styles.activeRow]}>
    <Pressable style={styles.songInfo} onPress={onPlay}>
      <Image source={item.image} style={styles.songImage} />
      <View style={styles.songTextContainer}>
        <Text numberOfLines={1} style={styles.songTitle}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.songArtist}>{item.artist}</Text>
      </View>
    </Pressable>
    <View style={styles.songActions}>
      <Text style={styles.duration}>{item.duration}</Text>
      <Pressable onPress={onMore} style={styles.moreBtn}>
        <Text style={styles.moreIcon}>⋮</Text>
      </Pressable>
    </View>
  </View>
);

const SongsSection = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<SongOptionsSheetRef>(null);
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const {
    songs,
    loading,
    loadingMore,
    error,
    hasMore,
    refetch,
    loadMore,
    search,
  } = useSongs("top hindi songs");

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      search(searchQuery.trim());
    } else {
      search("top hindi songs");
    }
  }, [searchQuery, search]);

  const handlePlayPress = (song: any) => {
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

  const handleAddToQueue = (song: any) => {
    dispatch(addToQueue({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
      audio: song.audio,
    }));
    bottomSheetRef.current?.close();
  };

  const handlePlayNext = (song: any) => {
    dispatch(addNextToPlay({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
      audio: song.audio,
    }));
    bottomSheetRef.current?.close();
  };

  const handleMorePress = (song: any) => {
    setSelectedSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      image: song.image,
    });
    bottomSheetRef.current?.open();
  };

  const renderItem = ({ item }: { item: any }) => (
    <SongItemRow
      item={item}
      onPlay={() => handlePlayPress(item)}
      onMore={() => handleMorePress(item)}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#FFA500" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load songs</Text>
        <Pressable onPress={refetch}>
          <Text style={{ color: "#FFA500", marginTop: 10 }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.searchToggle}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Text style={styles.searchToggleText}>
            {showSearch ? "✕ Close" : "🔍 Search"}
          </Text>
        </Pressable>
        <Text style={styles.count}>{songs.length} songs</Text>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#999"
          />
          <Pressable style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />

      <SongOptionsSheet
        ref={bottomSheetRef}
        song={selectedSong}
        onAddToQueue={() => selectedSong && handleAddToQueue({
          ...selectedSong,
          audio: songs.find(s => s.id === selectedSong.id)?.audio || ""
        })}
        onPlayNext={() => selectedSong && handlePlayNext({
          ...selectedSong,
          audio: songs.find(s => s.id === selectedSong.id)?.audio || ""
        })}
      />
    </View>
  );
};

export default SongsSection;

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
  searchToggle: {
    padding: 8,
  },
  searchToggleText: {
    color: "#FFA500",
    fontWeight: "600",
  },
  count: {
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "grey",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 120,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activeRow: {
    backgroundColor: "#FFF8E7",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  songInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  songTextContainer: {
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
  songActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  duration: {
    fontSize: 12,
    color: "#666",
  },
  moreBtn: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 18,
    color: "#444",
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
