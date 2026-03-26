import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SongItem {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  image: { uri: string };
  audio: string; 
}

interface VerticalListProps {
  data: SongItem[];
  onMorePress?: (item: SongItem) => void;
  onPlayPress?: (item: SongItem) => void;
}

const VerticalList = ({
  data,
  onMorePress,
  onPlayPress,
}: VerticalListProps) => {
  const renderItem = ({ item }: { item: SongItem }) => (
    <View style={styles.row}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <Text numberOfLines={1} style={styles.artist}>
            {item.artist}
          </Text>

          <Text style={styles.duration}>| {item.duration}</Text>
        </View>
      </View>

      <Pressable style={styles.playBtn} onPress={() => onPlayPress?.(item)}>
        <Ionicons name="play" size={18} color="orange" />
      </Pressable>

      <Pressable style={styles.moreBtn} onPress={() => onMorePress?.(item)}>
        <Ionicons name="ellipsis-vertical" size={18} color="#444" />
      </Pressable>
    </View>
  );

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default VerticalList;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 2,
  },

  artist: {
    color: "#666",
    fontSize: 13,
  },

  duration: {
    color: "#666",
    fontSize: 13,
    marginLeft: 6,
  },

  playBtn: {
    marginHorizontal: 10,
  },

  moreBtn: {
    paddingHorizontal: 6,
  },
});
