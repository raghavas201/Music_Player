import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import saavnService from '../services/saavnService';
import { getImageUrl } from '../utils/helpers';

export const HomeScreen = ({ navigation }: any) => {
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // ✅ IMPORTANT: real query
      const songsRes = await saavnService.searchSongs('arijit');
      const artistsRes = await saavnService.searchArtists('arijit');

      setRecentSongs(songsRes.songs.slice(0, 6));
      setTopArtists(artistsRes.artists.slice(0, 3));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎵 Mume</Text>
        <Feather name="search" size={22} />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Suggested</Text>
        <Text style={styles.tab}>Songs</Text>
        <Text style={styles.tab}>Artists</Text>
        <Text style={styles.tab}>Albums</Text>
      </View>

      {/* RECENTLY PLAYED */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Recently Played</Text>
          <Text style={styles.link}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSongs.slice(0, 3).map((song) => (
            <View key={song.id} style={styles.card}>
              <Image
                source={{ uri: getImageUrl(song.image) }}
                style={styles.image}
              />
              <Text numberOfLines={2}>{song.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ARTISTS */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Artists</Text>
          <Text style={styles.link}>See All</Text>
        </View>

        <View style={styles.artistRow}>
          {topArtists.map((artist) => (
            <View key={artist.id} style={styles.artist}>
              <Image
                source={{ uri: getImageUrl(artist.image) }}
                style={styles.artistImg}
              />
              <Text numberOfLines={1}>{artist.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* MOST PLAYED */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.title}>Most Played</Text>
          <Text style={styles.link}>See All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSongs.slice(3, 6).map((song) => (
            <View key={song.id} style={styles.card}>
              <Image
                source={{ uri: getImageUrl(song.image) }}
                style={styles.image}
              />
              <Text numberOfLines={2}>{song.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },

  center: { flex: 1, justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  logo: { fontSize: 20, fontWeight: 'bold' },

  tabs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },

  activeTab: { color: 'orange', fontWeight: '600' },

  tab: { color: 'gray' },

  section: { marginBottom: 20 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: { fontWeight: 'bold', fontSize: 16 },

  link: { color: 'orange' },

  card: {
    width: 110,
    marginRight: 12,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 6,
  },

  artistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  artist: { alignItems: 'center' },

  artistImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
});