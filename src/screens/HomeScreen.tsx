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
import { usePlayerStore } from '../stores/playerStore';
import { getImageUrl } from '../utils/helpers';
import { Colors, Spacing, Typography } from '../utils/colors';

export const HomeScreen = ({ navigation }: any) => {
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Read isDarkMode from global store
  const { playSong, isDarkMode } = usePlayerStore();

  const bg = isDarkMode ? Colors.dark : Colors.background;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const subColor = isDarkMode ? Colors.gray : Colors.lightText;
  const cardBg = isDarkMode ? '#1E1E1E' : '#F0F0F0';

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
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

  const handleSongPress = (song: any) => {
    playSong(song, recentSongs);
    navigation.navigate('Player', { song });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: textColor }]}>🎵 Mume</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Songs', { searchQuery: '' })}>
          <Feather name="search" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Suggested</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Songs')}>
          <Text style={[styles.tab, { color: subColor }]}>Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Artists')}>
          <Text style={[styles.tab, { color: subColor }]}>Artists</Text>
        </TouchableOpacity>
      </View>

      {/* RECENTLY PLAYED */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: textColor }]}>Recently Played</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Songs', { searchQuery: 'arijit' })}>
            <Text style={styles.link}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSongs.slice(0, 3).map((song) => (
            <TouchableOpacity key={song.id} style={[styles.card, { backgroundColor: cardBg }]} onPress={() => handleSongPress(song)}>
              <Image source={{ uri: getImageUrl(song.image) }} style={styles.image} />
              <Text numberOfLines={2} style={[styles.cardText, { color: textColor }]}>{song.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ARTISTS */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: textColor }]}>Artists</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Artists')}>
            <Text style={styles.link}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.artistRow}>
          {topArtists.map((artist) => (
            <View key={artist.id} style={styles.artist}>
              <Image source={{ uri: getImageUrl(artist.image) }} style={styles.artistImg} />
              <Text numberOfLines={1} style={[styles.cardText, { color: textColor }]}>{artist.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* MOST PLAYED */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.title, { color: textColor }]}>Most Played</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Songs', { searchQuery: 'popular hindi' })}>
            <Text style={styles.link}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSongs.slice(3, 6).map((song) => (
            <TouchableOpacity key={song.id} style={[styles.card, { backgroundColor: cardBg }]} onPress={() => handleSongPress(song)}>
              <Image source={{ uri: getImageUrl(song.image) }} style={styles.image} />
              <Text numberOfLines={2} style={[styles.cardText, { color: textColor }]}>{song.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: Spacing.xl },
  logo: { fontSize: 20, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  activeTab: { color: Colors.primary, fontWeight: '600' },
  tab: { fontWeight: '400' },
  section: { marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
  link: { color: Colors.primary },
  card: { width: 115, marginRight: 12, borderRadius: 12, padding: 8 },
  cardText: { fontSize: 12, marginTop: 4 },
  image: { width: 99, height: 99, borderRadius: 10 },
  artistRow: { flexDirection: 'row', justifyContent: 'space-between' },
  artist: { alignItems: 'center' },
  artistImg: { width: 70, height: 70, borderRadius: 35, marginBottom: 5 },
});