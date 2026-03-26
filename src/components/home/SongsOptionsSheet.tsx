import React, { forwardRef, useRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

export interface SongData {
  id: string | number;
  title: string;
  artist: string;
  duration?: string;
  image: { uri: string };
}

interface Props {
  song: SongData | null;
  onPlayNext?: () => void;
  onAddToQueue?: () => void;
}

export interface SongOptionsSheetRef {
  open: () => void;
  close: () => void;
}

const ACTIONS = [
  { label: "Play Next", icon: "play-forward", key: "playNext" },
  { label: "Add to Playing Queue", icon: "list", key: "addToQueue" },
  { label: "Add to Playlist", icon: "heart-outline", key: "addToPlaylist" },
  { label: "Go to Album", icon: "disc", key: "goToAlbum" },
  { label: "Go to Artist", icon: "person", key: "goToArtist" },
  { label: "Details", icon: "information-circle-outline", key: "details" },
  { label: "Share", icon: "share-social-outline", key: "share" },
  { label: "Delete from Device", icon: "trash-outline", key: "delete" },
];

const SongOptionsSheet = forwardRef<SongOptionsSheetRef, Props>(
  ({ song, onPlayNext, onAddToQueue }: Props, ref: React.Ref<SongOptionsSheetRef>) => {
    const sheetRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const handleActionPress = (key: string) => {
      switch (key) {
        case "playNext":
          onPlayNext?.();
          break;
        case "addToQueue":
          onAddToQueue?.();
          break;
        default:
          break;
      }
      sheetRef.current?.close();
    };

    return (
      <RBSheet
        ref={sheetRef}
        height={520}
        openDuration={250}
        draggable
        closeOnPressMask
        customStyles={{
          wrapper: {
            backgroundColor: "#00000055",
          },
          draggableIcon: {
            backgroundColor: "#ccc",
            width: 40,
          },
          container: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            paddingBottom: 30,
          },
        }}
      >
        {song && (
          <View style={styles.header}>
            <Image
              source={song.image}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {song.title}
              </Text>

              <Text style={styles.artist}>
                {song.artist}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {ACTIONS.map((action) => {
          return (
            <TouchableOpacity
              key={action.key}
              style={styles.row}
              onPress={() => handleActionPress(action.key)}
            >
              <Ionicons name={action.icon as any} size={22} color="#333" />

              <Text style={styles.label}>
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </RBSheet>
    );
  }
);

export default SongOptionsSheet;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
  },

  artist: {
    color: "#666",
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
  },
});
