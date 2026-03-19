import { create } from 'zustand';
import { Song, PlayerState } from '../types';

interface PlayerStore extends PlayerState {
  setCurrentSong: (song: Song | null) => void;
  setQueue: (songs: Song[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'off' | 'all' | 'one') => void;
  nextSong: () => void;
  previousSong: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (from: number, to: number) => void;
  addToFavorites: (song: Song) => void;
  removeFromFavorites: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addToDownloaded: (song: Song) => void;
  removeFromDownloaded: (songId: string) => void;
  isDownloaded: (songId: string) => boolean;
  loadState: () => void;
}

const initialState: PlayerState = {
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
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  setCurrentSong: (song) => {
    set({ currentSong: song });
  },

  setQueue: (songs) => {
    set({ queue: songs });
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setPosition: (position) => set({ position }),

  setDuration: (duration) => set({ duration }),

  toggleShuffle: () => {
    set({ shuffle: !get().shuffle });
  },

  setRepeat: (mode) => {
    set({ repeat: mode });
  },

  nextSong: () => {
    const { queue, currentIndex, repeat } = get();
    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
      position: 0,
    });
  },

  previousSong: () => {
    const { currentIndex, queue } = get();
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    set({
      currentIndex: prevIndex,
      currentSong: queue[prevIndex],
      position: 0,
    });
  },

  addToQueue: (song) => {
    const queue = get().queue;
    set({ queue: [...queue, song] });
  },

  removeFromQueue: (index) => {
    const queue = get().queue;
    set({ queue: queue.filter((_, i) => i !== index) });
  },

  reorderQueue: (from, to) => {
    const queue = [...get().queue];
    const item = queue.splice(from, 1)[0];
    queue.splice(to, 0, item);
    set({ queue });
  },

  addToFavorites: (song) => {
    const favorites = get().favorites;
    const newFavorites = [song, ...favorites].filter(
      (s, i, arr) => arr.findIndex(f => f.id === s.id) === i
    );
    set({ favorites: newFavorites });
  },

  removeFromFavorites: (songId) => {
    set({
      favorites: get().favorites.filter(s => s.id !== songId),
    });
  },

  isFavorite: (songId) => {
    return get().favorites.some(s => s.id === songId);
  },

  addToDownloaded: (song) => {
    const downloaded = get().downloadedSongs;
    const newDownloaded = [song, ...downloaded].filter(
      (s, i, arr) => arr.findIndex(f => f.id === s.id) === i
    );
    set({ downloadedSongs: newDownloaded });
  },

  removeFromDownloaded: (songId) => {
    set({
      downloadedSongs: get().downloadedSongs.filter(s => s.id !== songId),
    });
  },

  isDownloaded: (songId) => {
    return get().downloadedSongs.some(s => s.id === songId);
  },

  // 🚀 TEMP: disabled (no MMKV)
  loadState: () => {},
}));