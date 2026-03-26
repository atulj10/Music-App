import { File, Directory, Paths } from 'expo-file-system';

const DOWNLOADS_DIR = new Directory(Paths.document, 'downloads');
const METADATA_FILE = new File(DOWNLOADS_DIR, 'metadata.json');

export interface DownloadMetadata {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: { uri: string };
}

interface DownloadProgress {
  songId: string;
  progress: number;
}

type ProgressCallback = (progress: DownloadProgress) => void;

class DownloadService {
  private progressListeners: ProgressCallback[] = [];
  private activeDownloads: Set<string> = new Set();
  private downloadedSongs: Map<string, string> = new Map();
  private metadata: Map<string, DownloadMetadata> = new Map();

  async initialize() {
    if (!DOWNLOADS_DIR.exists) {
      DOWNLOADS_DIR.create();
    }
    await this.loadMetadata();
    await this.loadDownloadedSongs();
  }

  private async loadMetadata() {
    try {
      if (!METADATA_FILE.exists) return;
      
      const content = await METADATA_FILE.text();
      const data = JSON.parse(content);
      
      for (const [id, meta] of Object.entries(data)) {
        this.metadata.set(id, meta as DownloadMetadata);
      }
    } catch (error) {
      console.log('Error loading metadata:', error);
    }
  }

  private async saveMetadata() {
    try {
      const data: Record<string, DownloadMetadata> = {};
      this.metadata.forEach((value, key) => {
        data[key] = value;
      });
      METADATA_FILE.write(JSON.stringify(data));
    } catch (error) {
      console.log('Error saving metadata:', error);
    }
  }

  private async loadDownloadedSongs() {
    try {
      if (!DOWNLOADS_DIR.exists) return;
      
      const contents = DOWNLOADS_DIR.list();
      for (const item of contents) {
        if (item instanceof File && item.name.endsWith('.mp3')) {
          const songId = item.name.replace('.mp3', '');
          const uri = item.uri;
          this.downloadedSongs.set(songId, uri);
        }
      }
    } catch (error) {
      console.log('Error loading downloaded songs:', error);
    }
  }

  private generateFileName(songId: string): string {
    return songId + '.mp3';
  }

  isDownloaded(songId: string): boolean {
    return this.downloadedSongs.has(songId);
  }

  getLocalUri(songId: string): string | null {
    return this.downloadedSongs.get(songId) || null;
  }

  isDownloading(songId: string): boolean {
    return this.activeDownloads.has(songId);
  }

  async downloadSong(
    songId: string,
    audioUrl: string,
    metadata?: Omit<DownloadMetadata, 'id'>
  ): Promise<string | null> {
    if (this.activeDownloads.has(songId)) {
      return null;
    }

    if (this.downloadedSongs.has(songId)) {
      return this.downloadedSongs.get(songId) || null;
    }

    try {
      const fileName = this.generateFileName(songId);
      const destinationFile = new File(DOWNLOADS_DIR, fileName);

      this.activeDownloads.add(songId);
      this.notifyProgress({ songId, progress: 0 });

      const result = await File.downloadFileAsync(audioUrl, destinationFile, {
        idempotent: true,
      });

      this.activeDownloads.delete(songId);
      this.notifyProgress({ songId, progress: 1 });

      if (result) {
        this.downloadedSongs.set(songId, result.uri);
        
        if (metadata) {
          this.metadata.set(songId, { id: songId, ...metadata });
          await this.saveMetadata();
        }
        
        return result.uri;
      }

      return null;
    } catch (error) {
      console.log('Download error:', error);
      this.activeDownloads.delete(songId);
      this.notifyProgress({ songId, progress: -1 });
      return null;
    }
  }

  async deleteSong(songId: string): Promise<boolean> {
    const fileName = this.generateFileName(songId);
    const file = new File(DOWNLOADS_DIR, fileName);

    try {
      if (file.exists) {
        file.delete();
      }
      this.downloadedSongs.delete(songId);
      this.metadata.delete(songId);
      await this.saveMetadata();
      return true;
    } catch (error) {
      console.log('Delete error:', error);
      return false;
    }
  }

  getDownloadMetadata(songId: string): DownloadMetadata | null {
    return this.metadata.get(songId) || null;
  }

  getAllDownloadsWithMetadata(): DownloadMetadata[] {
    return Array.from(this.metadata.values());
  }

  addProgressListener(callback: ProgressCallback) {
    this.progressListeners.push(callback);
  }

  removeProgressListener(callback: ProgressCallback) {
    this.progressListeners = this.progressListeners.filter(cb => cb !== callback);
  }

  private notifyProgress(progress: DownloadProgress) {
    this.progressListeners.forEach(cb => cb(progress));
  }

  getDownloadedSongsCount(): number {
    return this.downloadedSongs.size;
  }

  getAllDownloadedSongIds(): string[] {
    return Array.from(this.downloadedSongs.keys());
  }
}

export const downloadService = new DownloadService();
