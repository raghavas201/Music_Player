import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Artist } from '../types';
import saavnService from '../services/saavnService';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';
import { ArtistCard } from '../components/ArtistCard';

export const ArtistsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadArtists();
    }, [])
  );

  const loadArtists = async () => {
    try {
      setLoading(true);
      const result = await saavnService.searchArtists('popular');
      setArtists(result.artists);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderArtistCard = ({ item }: { item: Artist }) => (
    <ArtistCard
      artist={item}
      isDarkMode={isDarkMode}
      onPress={() => navigation.navigate('ArtistDetail', { artist: item })}
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
          <Feather name="music" size={24} color={Colors.primary} />
          <Text style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
            Mume
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Feather
            name="search"
            size={24}
            color={isDarkMode ? Colors.darkText : Colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Suggested', 'Songs', 'Artists', 'Albums', 'Playlists'].map((tab) => (
          <TouchableOpacity key={tab}>
            <Text
              style={[
                styles.tab,
                {
                  color:
                    tab === 'Artists'
                      ? Colors.primary
                      : isDarkMode
                        ? Colors.gray
                        : Colors.lightText,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Artists List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={artists}
          renderItem={renderArtistCard}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  tab: {
    ...Typography.bodyBold,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
