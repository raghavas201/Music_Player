import client from '../api/client';

const saavnService = {
  searchSongs: async (query: string) => {
    try {
      const res = await client.get('/api/search/songs', {
        params: { query },
      });

      const data = res?.data?.data;

      return {
        songs: Array.isArray(data?.results) ? data.results : [],
        total: data?.total || 0,
      };
    } catch (error) {
      console.error(error);
      return { songs: [], total: 0 };
    }
  },

  searchArtists: async (query: string) => {
    try {
      const res = await client.get('/api/search/artists', {
        params: { query },
      });

      return {
        artists: res?.data?.data?.results || [],
      };
    } catch {
      return { artists: [] };
    }
  },
};

export default saavnService;