import { createAudioPlayer, AudioPlayer } from "expo-audio";

type ProgressCallback = (status: {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  didJustFinish: boolean;
}) => void;

class AudioService {
  private player: AudioPlayer;

  private progressListeners: ProgressCallback[] = [];

  private pollInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.player = createAudioPlayer();
  }

  /*
  START POLLING ONLY WHEN NEEDED
  */

  private startPolling() {
    if (this.pollInterval) return;

    this.pollInterval = setInterval(() => {
      const status: any = this.player.currentStatus;

      if (!status) return;

      const progress = {
        isPlaying: status.playing || false,

        positionMillis: (status.currentTime || 0) * 1000,
        durationMillis: (status.duration || 0) * 1000,

        didJustFinish: status.didJustFinish || false,
      };

      this.progressListeners.forEach((callback) => callback(progress));
    }, 500);
  }

  private stopPolling() {
    if (!this.pollInterval) return;

    clearInterval(this.pollInterval);

    this.pollInterval = null;
  }

  /*
  PLAYBACK
  */

  async play(uri: string) {
    try {
      await this.player.replace({
        uri,
      });

      await this.player.play();
    } catch (error) {
      console.log("Audio play error:", error);
    }
  }

  async pause() {
    try {
      await this.player.pause();
    } catch (error) {
      console.log("Audio pause error:", error);
    }
  }

  async resume() {
    try {
      await this.player.play();
    } catch (error) {
      console.log("Audio resume error:", error);
    }
  }

  /*
  SEEK
  */

  async seekTo(positionMillis: number) {
    try {
      await this.player.seekTo(positionMillis / 1000);
    } catch (error) {
      console.log("Audio seek error:", error);
    }
  }

  async seekForward(seconds = 10) {
    const status = this.getStatus();

    const newPosition = Math.min(
      status.positionMillis + seconds * 1000,
      status.durationMillis,
    );

    await this.seekTo(newPosition);
  }

  async seekBackward(seconds = 10) {
    const status = this.getStatus();

    const newPosition = Math.max(status.positionMillis - seconds * 1000, 0);

    await this.seekTo(newPosition);
  }

  /*
  STATUS
  */

  getStatus() {
    const status: any = this.player.currentStatus;

    return {
      isPlaying: status?.playing || false,

      positionMillis: (status?.currentTime || 0) * 1000,

      durationMillis: (status?.duration || 0) * 1000,

      didJustFinish: status?.didJustFinish || false,
    };
  }

  isPlaying(): boolean {
    return this.getStatus().isPlaying;
  }

  /*
  LISTENERS
  */

  addProgressListener(callback: ProgressCallback) {
    this.progressListeners.push(callback);

    this.startPolling();
  }

  removeProgressListener(callback: ProgressCallback) {
    this.progressListeners = this.progressListeners.filter(
      (cb) => cb !== callback,
    );

    if (this.progressListeners.length === 0) {
      this.stopPolling();
    }
  }

  /*
  CLEANUP
  */

  cleanup() {
    this.stopPolling();
  }

  getPlayer() {
    return this.player;
  }
}

export const audioService = new AudioService();
