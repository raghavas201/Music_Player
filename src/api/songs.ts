import client from './client';
import type { Song, SearchResult } from '../types';

export async function searchSongs(query: string, page = 1): Promise<SearchResult> {
  try {
    const res = await client.get('/api/search/songs', {
      params: { query, page, limit: 20 },
    });

    const d = res?.data?.data ?? {};

    return {
      results: Array.isArray(d.results) ? d.results : [],
      total: typeof d.total === 'number' ? d.total : 0,
      start: typeof d.start === 'number' ? d.start : 1,
    };
  } catch (error) {
    console.error('searchSongs error:', error);
    return { results: [], total: 0, start: 1 };
  }
}

export async function getSongById(id: string): Promise<Song | null> {
  try {
    const res = await client.get(`/api/songs/${id}`);
    const songs = res?.data?.data;

    if (Array.isArray(songs) && songs.length > 0) {
      return songs[0];
    }

    return null;
  } catch (error) {
    console.error('getSongById error:', error);
    return null;
  }
}

export async function getSuggestions(id: string): Promise<Song[]> {
  try {
    const res = await client.get(`/api/songs/${id}/suggestions`);
    const data = res?.data?.data;

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('getSuggestions error:', error);
    return [];
  }
}
