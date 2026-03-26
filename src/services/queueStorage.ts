import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../store/slices/playerSlice";

const QUEUE_KEY = "@music_player_queue";

export const queueStorage = {
  async save(queue: Song[]) {
    try {
      await AsyncStorage.setItem(
        QUEUE_KEY,
        JSON.stringify(queue)
      );
    } catch (error) {
      console.log("Save queue error:", error);
    }
  },

  async load(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(
        QUEUE_KEY
      );

      if (!data) return [];

      return JSON.parse(data);
    } catch (error) {
      console.log("Load queue error:", error);
      return [];
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(
        QUEUE_KEY
      );
    } catch (error) {
      console.log("Clear queue error:", error);
    }
  },
};