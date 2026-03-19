// ================== SONG ==================
export interface Song {
  id: string;
  name: string;

  album: Album;

  artists: {
    primary: Artist[];
    featured?: Artist[];
    all?: Artist[];
  };

  primaryArtists?: string;
  primaryArtistsId?: string;

  duration: number;

  image: Image[];
  downloadUrl: DownloadUrl[];

  playCount?: string;
  language?: string;
  hasLyrics?: string;
  url?: string;
}

// ================== ALBUM ==================
export interface Album {
  id: string | null;
  name: string | null;
  url?: string | null;
}

// ================== ARTIST ==================
export interface Artist {
  id: string;
  name: string;

  image?: Image[];

  role?: string;
  type?: string;
  url?: string;

  songCount?: number;
  albumCount?: number;
}

// ================== IMAGE ==================
export interface Image {
  quality: string;
  url?: string;
  link?: string;
}

// ================== DOWNLOAD ==================
export interface DownloadUrl {
  quality: string;
  url?: string;
  link?: string;
}

// ================== SEARCH RESULT ==================
export interface SearchResult {
  results: Song[];
  total: number;
  start: number;
}

// ================== ARTIST SEARCH ==================
export interface ArtistSearchResult {
  artists: Artist[];
}

// ================== PLAYER STATE ==================
export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  duration: number;
  position: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  favorites: Song[];
  downloadedSongs: Song[];
}

// ================== FILTERS ==================
export interface SearchFilters {
  sortBy:
    | 'Ascending'
    | 'Descending'
    | 'Artist'
    | 'Album'
    | 'Year'
    | 'Date Added'
    | 'Date Modified'
    | 'Composer';
}