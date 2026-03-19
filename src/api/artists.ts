import client from './client';
import type { Song } from '../types';

export async function getArtistSongs(artistId: string, page = 1): Promise<Song[]> {
  try {
    const res = await client.get(`/api/artists/${artistId}/songs`, {
      params: { page },
    });
    return res.data?.data?.results || [];
  } catch {
    return [];
  }
}
