import React from 'react';
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
  const [isDarkMode] = React.useState(true);
  const { favorites, setQueue, setCurrentSong, setIsPlaying, currentSong } = usePlayerStore();

  useFocusEffect(
    React.useCallback(() => {
      // Refresh favorites when screen is focused
    }, [])
  );

  const handlePlaySong = (song: Song) => {
    setQueue(favorites);
    setCurrentSong(song);
    setIsPlaying(true);
    navigation.navigate('Player', { song });
  };

  const renderSongCard = ({ item }: { item: Song }) => (
    <SongCard
      song={item}
      isDarkMode={isDarkMode}
      isPlaying={currentSong?.id === item.id}
      onPress={() => navigation.navigate('Player', { song: item })}
      onPlayPress={() => handlePlaySong(item)}
      onMenuPress={() => {/* Show menu */}}
    />
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark : Colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="heart" size={24} color={Colors.primary} />
          <Text style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
            Favorites
          </Text>
        </View>
      </View>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={48} color={Colors.primary} />
          <Text style={[styles.emptyText, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
            No favorite songs yet
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h4,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 150,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.lg,
  },
});
