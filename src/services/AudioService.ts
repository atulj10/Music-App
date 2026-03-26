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
    this.startPolling();
  }

  private startPolling() {
    if (this.pollInterval) return;
    
    this.pollInterval = setInterval(() => {
      const status = this.player.currentStatus as any;
      if (status) {
        const progress = {
          isPlaying: status.playing || false,
          positionMillis: status.positionMillis || 0,
          durationMillis: status.durationMillis || 0,
          didJustFinish: false,
        };
        this.progressListeners.forEach(callback => callback(progress));
      }
    }, 500);
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async play(uri: string) {
    try {
      await this.player.replace({ uri });
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

  async seekTo(positionMillis: number) {
    try {
      await this.player.seekTo(positionMillis);
    } catch (error) {
      console.log("Audio seek error:", error);
    }
  }

  async seekForward(seconds = 10) {
    const status = this.getStatus();
    const newPosition = Math.min(
      (status.positionMillis || 0) + seconds * 1000,
      status.durationMillis || 0
    );
    await this.seekTo(newPosition);
  }

  async seekBackward(seconds = 10) {
    const status = this.getStatus();
    const newPosition = Math.max((status.positionMillis || 0) - seconds * 1000, 0);
    await this.seekTo(newPosition);
  }

  getStatus(): {
    isPlaying: boolean;
    positionMillis: number;
    durationMillis: number;
    didJustFinish: boolean;
  } {
    const status = this.player.currentStatus as any;
    return {
      isPlaying: status?.playing || false,
      positionMillis: status?.positionMillis || 0,
      durationMillis: status?.durationMillis || 0,
      didJustFinish: false,
    };
  }

  isPlaying(): boolean {
    return this.getStatus().isPlaying;
  }

  addProgressListener(callback: ProgressCallback) {
    this.progressListeners.push(callback);
  }

  removeProgressListener(callback: ProgressCallback) {
    this.progressListeners = this.progressListeners.filter(cb => cb !== callback);
  }

  getPlayer() {
    return this.player;
  }

  cleanup() {
    this.stopPolling();
  }
}

export const audioService = new AudioService();
