import { createAudioPlayer } from "expo-audio";

class AudioService {
  private player = createAudioPlayer();

  async play(uri: string) {
    try {
      await this.player.replace({
        uri,
      });

      await this.player.play();
    } catch (error) {
      console.log("Audio error:", error);
    }
  }

  async pause() {
    await this.player.pause();
  }

  async resume() {
    await this.player.play();
  }

  async stop() {
    await this.player.stop();
  }
}

export const audioService = new AudioService();