import React, { useRef, useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import SongOptionsSheet, {
  SongData,
  SongOptionsSheetRef,
} from "../SongsOptionsSheet";

import { useSongs } from "../../../hooks/useSongs";

import {
  setCurrentSong,
  addToQueue,
  addNextToPlay,
} from "../../../store/slices/playerSlice";

const SongItemRow = ({
  item,
  onPlay,
  onMore,
}: {
  item: any;
  onPlay: () => void;
  onMore: () => void;
}) => (
  <Pressable style={styles.songRow} onPress={onPlay}>
    <Image source={item.image} style={styles.songImage} />

    <View style={styles.songTextContainer}>
      <Text numberOfLines={1} style={styles.songTitle}>
        {item.title}
      </Text>

      <Text numberOfLines={1} style={styles.songArtist}>
        {item.artist}
      </Text>
    </View>

    <View style={styles.songActions}>
      <Text style={styles.duration}>{item.duration}</Text>

      <Pressable onPress={onMore} style={styles.moreBtn} hitSlop={10}>
        <Ionicons name="ellipsis-vertical" size={18} color="#666" />
      </Pressable>
    </View>
  </Pressable>
);

const SongsSection = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const bottomSheetRef = useRef<SongOptionsSheetRef>(null);

  const onEndReachedCalledDuringMomentum = useRef(false);

  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);

  const { songs, loading, loadingMore, error, hasMore, refetch, loadMore } =
    useSongs("top hindi songs");

  /*
  PLAY
  */

  const handlePlayPress = (song: any) => {
    dispatch(
      setCurrentSong({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        image: song.image,
        audio: song.audio,
      }),
    );

    navigation.navigate("PlayerScreen");
  };

  /*
  QUEUE
  */

  const handleAddToQueue = (song: any) => {
    dispatch(
      addToQueue({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        image: song.image,
        audio: song.audio,
      }),
    );

    bottomSheetRef.current?.close();
  };

  const handlePlayNext = (song: any) => {
    dispatch(
      addNextToPlay({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        image: song.image,
        audio: song.audio,
      }),
    );

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

  /*
  INFINITE SCROLL
  */

  const handleEndReached = useCallback(() => {
    if (
      !onEndReachedCalledDuringMomentum.current &&
      hasMore &&
      !loadingMore &&
      !loading
    ) {
      loadMore();

      onEndReachedCalledDuringMomentum.current = true;
    }
  }, [hasMore, loadingMore, loading]);

  /*
  RENDER ITEM
  */

  const renderItem = ({ item }: any) => (
    <SongItemRow
      item={item}
      onPlay={() => handlePlayPress(item)}
      onMore={() => handleMorePress(item)}
    />
  );

  /*
  FOOTER
  */

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator size="small" color="#FFA500" />
      </View>
    );
  };

  /*
  HEADER
  */

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.count}>{songs.length} songs</Text>

      <Pressable onPress={refetch} style={styles.refreshBtn}>
        <Ionicons name="refresh" size={18} color="#FFA500" />
        <Text style={styles.refreshText}> Refresh</Text>
      </Pressable>
    </View>
  );

  /*
  LOADING
  */

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFA500" />

        <Text style={styles.loadingText}>Loading songs...</Text>
      </View>
    );
  }

  /*
  ERROR
  */

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load songs</Text>

        <Pressable style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  /*
  LIST
  */

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews
      />

      <SongOptionsSheet
        ref={bottomSheetRef}
        song={selectedSong}
        onAddToQueue={() =>
          selectedSong &&
          handleAddToQueue({
            ...selectedSong,
            audio: songs.find((s) => s.id === selectedSong.id)?.audio || "",
          })
        }
        onPlayNext={() =>
          selectedSong &&
          handlePlayNext({
            ...selectedSong,
            audio: songs.find((s) => s.id === selectedSong.id)?.audio || "",
          })
        }
      />
    </View>
  );
};

export default SongsSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  count: {
    fontWeight: "700",
    fontSize: 16,
  },

  refreshText: {
    color: "#FFA500",
    fontWeight: "600",
  },

  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  listContent: {
    paddingBottom: 120,
  },

  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    padding: 4,
  },

  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  retryBtn: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },

  retryText: {
    color: "#fff",
    fontWeight: "600",
  },

  errorText: {
    color: "#666",
    marginBottom: 16,
  },
});
