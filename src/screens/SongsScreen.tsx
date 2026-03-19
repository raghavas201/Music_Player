import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Song } from '../types';
import saavnService from '../services/saavnService';
import { usePlayerStore } from '../stores/playerStore';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';
import { SongCard } from '../components/SongCard';

type SortOption = 'Ascending' | 'Descending' | 'Artist' | 'Album' | 'Year' | 'Date Added' | 'Date Modified' | 'Composer';

const SORT_OPTIONS: SortOption[] = ['Ascending', 'Descending', 'Artist', 'Album', 'Year', 'Date Added', 'Date Modified', 'Composer'];

export const SongsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
  const [sortBy, setSortBy] = useState<SortOption>('Ascending');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isDarkMode] = useState(true);
  const actionSheetRef = useRef(null);

  const { setQueue, setCurrentSong, setIsPlaying, currentSong } = usePlayerStore();

  const loadSongs = useCallback(async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const result = await saavnService.searchSongs(query);
      setSongs(result.songs);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (searchQuery) {
      loadSongs(searchQuery);
    }
  }, [searchQuery, loadSongs]);

  const handlePlaySong = (song: Song) => {
    const currentQueue = songs;
    const index = songs.findIndex(s => s.id === song.id);

    setQueue(currentQueue);
    setCurrentSong(song);
    setIsPlaying(true);
    navigation.navigate('Player', { song });
  };

  const handleSortPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...SORT_OPTIONS],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSortBy(SORT_OPTIONS[buttonIndex - 1]);
          }
        }
      );
    } else {
      setShowSortModal(true);
    }
  };

  const renderSongCard = ({ item, index }: { item: Song; index: number }) => (
    <SongCard
      song={item}
      isDarkMode={isDarkMode}
      isPlaying={currentSong?.id === item.id}
      onPress={() => navigation.navigate('Player', { song: item })}
      onPlayPress={() => handlePlaySong(item)}
      onMenuPress={() => {
        setSelectedSongIndex(index);
        setShowContextMenu(true);
      }}
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
                    tab === 'Songs'
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

      {/* Search and Sort */}
      <View style={styles.controlsContainer}>
        <Text style={[styles.resultCount, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
          {songs.length} songs
        </Text>
        <TouchableOpacity onPress={handleSortPress}>
          <Text style={styles.sortButton}>{sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSongCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
                {searchQuery ? 'No songs found' : 'Search for songs to get started'}
              </Text>
            </View>
          }
        />
      )}

      {/* Sort Modal */}
      {Platform.OS !== 'ios' && (
        <Modal
          visible={showSortModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSortModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowSortModal(false)}
            activeOpacity={1}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? Colors.darkGray : Colors.background },
              ]}
            >
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    sortBy === option && styles.sortOptionActive,
                  ]}
                  onPress={() => {
                    setSortBy(option);
                    setShowSortModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      {
                        color: sortBy === option ? Colors.primary : (isDarkMode ? Colors.darkText : Colors.text),
                      },
                    ]}
                  >
                    {option}
                  </Text>
                  {sortBy === option && (
                    <Feather name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  resultCount: {
    ...Typography.body,
    fontWeight: '500',
  },
  sortButton: {
    color: Colors.primary,
    ...Typography.body,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    paddingVertical: Spacing.md,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sortOptionActive: {
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  sortOptionText: {
    ...Typography.body,
  },
});
