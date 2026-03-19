import { create } from 'zustand';
import { Song, PlayerState } from '../types';
import { audioService } from '../services/audioService';

// Helper to pick best download URL from a song
function getBestUrl(song: Song): string | null {
  if (!song.downloadUrl || song.downloadUrl.length === 0) return null;
  // Prefer highest quality: 320kbps > 160kbps > 96kbps > first available
  const quality320 = song.downloadUrl.find(d => d.quality === '320kbps');
  const quality160 = song.downloadUrl.find(d => d.quality === '160kbps');
  const first = song.downloadUrl[song.downloadUrl.length - 1] || song.downloadUrl[0];
  const best = quality320 || quality160 || first;
  return best?.url || best?.link || null;
}

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface PlayerStore extends PlayerState {
  originalQueue: Song[];   // preserves queue order while shuffle is on

  // Core playback
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seek: (positionSeconds: number) => Promise<void>;

  // Store setters used by audioService callbacks
  setCurrentSong: (song: Song | null) => void;
  setQueue: (songs: Song[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;

  // Queue navigation
  nextSong: () => Promise<void>;
  previousSong: () => Promise<void>;

  // Shuffle & Repeat
  toggleShuffle: () => void;
  setRepeat: (mode: 'off' | 'all' | 'one') => void;

  // Queue management
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (from: number, to: number) => void;

  // Favorites
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;

  // Downloads
  addToDownloaded: (song: Song) => void;
  removeFromDownloaded: (songId: string) => void;
  isDownloaded: (songId: string) => boolean;

  // Theme
  toggleDarkMode: () => void;

  loadState: () => void;
}

const initialState: PlayerState & { originalQueue: Song[]; isDarkMode: boolean } = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  duration: 0,
  position: 0,
  volume: 1,
  shuffle: false,
  repeat: 'off',
  favorites: [],
  downloadedSongs: [],
  originalQueue: [],
  isDarkMode: true,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  // ─── Core playback ──────────────────────────────────────────────────────────

  playSong: async (song: Song, newQueue?: Song[]) => {
    const state = get();

    // If a new queue is provided, store it; otherwise keep current queue
    let queue = newQueue ?? state.queue;
    let originalQueue = newQueue ?? state.originalQueue;

    // Apply shuffle if on
    if (state.shuffle && newQueue) {
      queue = shuffleArray(newQueue);
    }

    // Find index of song in the (possibly shuffled) queue
    let currentIndex = queue.findIndex(s => s.id === song.id);
    if (currentIndex === -1) {
      // Song not in queue — prepend it
      queue = [song, ...queue];
      originalQueue = [song, ...originalQueue];
      currentIndex = 0;
    }

    const url = getBestUrl(song);
    if (!url) {
      console.warn('[playerStore] No download URL for song:', song.name);
      return;
    }

    set({ currentSong: song, queue, originalQueue, currentIndex, isPlaying: true, position: 0, duration: 0 });

    await audioService.playSong(
      url,
      (position, duration) => {
        set({ position, duration });
      },
      async () => {
        // Song finished — advance queue
        await get().nextSong();
      }
    );
  },

  togglePlayPause: async () => {
    const { isPlaying, currentSong } = get();
    if (!currentSong) return;
    if (isPlaying) {
      await audioService.pause();
      set({ isPlaying: false });
    } else {
      await audioService.resume();
      set({ isPlaying: true });
    }
  },

  seek: async (positionSeconds: number) => {
    await audioService.seek(positionSeconds);
    set({ position: positionSeconds });
  },

  // ─── Setters ────────────────────────────────────────────────────────────────

  setCurrentSong: (song) => set({ currentSong: song }),
  setQueue: (songs) => set({ queue: songs, originalQueue: songs }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),

  // ─── Queue navigation ───────────────────────────────────────────────────────

  nextSong: async () => {
    const { queue, currentIndex, repeat } = get();

    if (repeat === 'one') {
      await audioService.seek(0);
      set({ position: 0 });
      await audioService.resume();
      return;
    }

    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        // End of queue
        await audioService.stop();
        set({ isPlaying: false, position: 0 });
        return;
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      await get().playSong(nextSong);
    }
  },

  previousSong: async () => {
    const { currentIndex, queue, position } = get();

    // If more than 3 seconds in, restart current song
    if (position > 3) {
      await audioService.seek(0);
      set({ position: 0 });
      return;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevSong = queue[prevIndex];
    if (prevSong) {
      await get().playSong(prevSong);
    }
  },

  // ─── Shuffle & Repeat ───────────────────────────────────────────────────────

  toggleShuffle: () => {
    const { shuffle, originalQueue, queue, currentSong } = get();

    if (!shuffle) {
      // Turning ON shuffle: shuffle queue, keep current song at front
      const withoutCurrent = originalQueue.filter(s => s.id !== currentSong?.id);
      const shuffled = shuffleArray(withoutCurrent);
      const newQueue = currentSong ? [currentSong, ...shuffled] : shuffled;
      set({ shuffle: true, queue: newQueue, currentIndex: 0 });
    } else {
      // Turning OFF shuffle: restore original order, find current song
      const idx = originalQueue.findIndex(s => s.id === currentSong?.id);
      set({ shuffle: false, queue: originalQueue, currentIndex: Math.max(0, idx) });
    }
  },

  setRepeat: (mode) => set({ repeat: mode }),

  // ─── Queue management ───────────────────────────────────────────────────────

  addToQueue: (song) => {
    const { queue, originalQueue } = get();
    set({
      queue: [...queue, song],
      originalQueue: [...originalQueue, song],
    });
  },

  removeFromQueue: (index) => {
    const { queue, originalQueue, currentIndex } = get();
    const removed = queue[index];
    const newQueue = queue.filter((_, i) => i !== index);
    const newOriginal = originalQueue.filter(s => s.id !== removed?.id);
    const newIndex = index < currentIndex ? currentIndex - 1 : currentIndex;
    set({ queue: newQueue, originalQueue: newOriginal, currentIndex: Math.max(0, newIndex) });
  },

  reorderQueue: (from, to) => {
    const queue = [...get().queue];
    const item = queue.splice(from, 1)[0];
    queue.splice(to, 0, item);
    set({ queue });
  },

  // ─── Favorites ──────────────────────────────────────────────────────────────

  addToFavorites: (song) => {
    const favorites = get().favorites;
    const newFavorites = [song, ...favorites].filter(
      (s, i, arr) => arr.findIndex(f => f.id === s.id) === i
    );
    set({ favorites: newFavorites });
  },

  removeFromFavorites: (songId) => {
    set({ favorites: get().favorites.filter(s => s.id !== songId) });
  },

  isFavorite: (songId) => get().favorites.some(s => s.id === songId),

  // ─── Downloads ──────────────────────────────────────────────────────────────

  addToDownloaded: (song) => {
    const downloaded = get().downloadedSongs;
    const newDownloaded = [song, ...downloaded].filter(
      (s, i, arr) => arr.findIndex(f => f.id === s.id) === i
    );
    set({ downloadedSongs: newDownloaded });
  },

  removeFromDownloaded: (songId) => {
    set({ downloadedSongs: get().downloadedSongs.filter(s => s.id !== songId) });
  },

  isDownloaded: (songId) => get().downloadedSongs.some(s => s.id === songId),

  // ─── Theme ──────────────────────────────────────────────────────────────────

  toggleDarkMode: () => set({ isDarkMode: !get().isDarkMode }),

  loadState: () => {},
}));