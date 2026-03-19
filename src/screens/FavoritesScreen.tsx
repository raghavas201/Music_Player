import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Song } from '../types';
import { usePlayerStore } from '../stores/playerStore';
import { Colors, Spacing, Typography } from '../utils/colors';
import { SongCard } from '../components/SongCard';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Read isDarkMode from global store
  const { favorites, playSong, currentSong, isDarkMode } = usePlayerStore();

  useFocusEffect(useCallback(() => {}, []));

  const handlePlaySong = (song: Song) => {
    playSong(song, favorites);
    navigation.navigate('Player', { song });
  };

  const renderSongCard = ({ item }: { item: Song }) => (
    <SongCard
      song={item}
      isDarkMode={isDarkMode}
      isPlaying={currentSong?.id === item.id}
      onPress={() => navigation.navigate('Player', { song: item })}
      onPlayPress={() => handlePlaySong(item)}
      onMenuPress={() => {}}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark : Colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="heart" size={24} color={Colors.primary} />
          <Text style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
            Favorites
          </Text>
        </View>
        <Text style={{ color: isDarkMode ? Colors.gray : Colors.lightText, fontSize: 13 }}>
          {favorites.length} songs
        </Text>
      </View>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={48} color={Colors.primary} />
          <Text style={[styles.emptyText, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
            No favorite songs yet.{'\n'}Tap the heart on any song!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderSongCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { ...Typography.h4 },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 150 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...Typography.body, marginTop: Spacing.lg, textAlign: 'center', lineHeight: 24 },
});
