import { Audio, AVPlaybackStatus } from 'expo-av';

type ProgressCallback = (position: number, duration: number) => void;
type EndCallback = () => void;

class AudioService {
  private sound: Audio.Sound | null = null;
  private isLoaded = false;
  private onProgressCallback: ProgressCallback | null = null;
  private onEndCallback: EndCallback | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private backgroundModeSet = false;

  async setBackgroundMode() {
    if (this.backgroundModeSet) return;
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.backgroundModeSet = true;
    } catch (e) {
      console.warn('[AudioService] setAudioMode failed:', e);
    }
  }

  async playSong(
    url: string,
    onProgress: ProgressCallback,
    onEnd: EndCallback
  ): Promise<void> {
    await this.setBackgroundMode();

    // Unload any previous sound
    await this.stop();

    this.onProgressCallback = onProgress;
    this.onEndCallback = onEnd;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        this.onPlaybackStatusUpdate.bind(this)
      );
      this.sound = sound;
      this.isLoaded = true;
    } catch (e) {
      console.error('[AudioService] playSong error:', e);
    }
  }

  private onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;

    const positionSecs = (status.positionMillis ?? 0) / 1000;
    const durationSecs = (status.durationMillis ?? 0) / 1000;

    if (this.onProgressCallback) {
      this.onProgressCallback(positionSecs, durationSecs);
    }

    if (status.didJustFinish && this.onEndCallback) {
      this.onEndCallback();
    }
  }

  async pause(): Promise<void> {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.pauseAsync();
      } catch (e) {
        console.warn('[AudioService] pause error:', e);
      }
    }
  }

  async resume(): Promise<void> {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.playAsync();
      } catch (e) {
        console.warn('[AudioService] resume error:', e);
      }
    }
  }

  async seek(positionSeconds: number): Promise<void> {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.setPositionAsync(positionSeconds * 1000);
      } catch (e) {
        console.warn('[AudioService] seek error:', e);
      }
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.sound = null;
      this.isLoaded = false;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.sound && this.isLoaded) {
      try {
        await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      } catch (e) {
        console.warn('[AudioService] setVolume error:', e);
      }
    }
  }
}

// Singleton
export const audioService = new AudioService();
