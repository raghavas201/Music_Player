import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Song } from '../types';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';

interface SongCardProps {
  song: Song;
  onPress: () => void;
  onPlayPress: () => void;
  onMenuPress: () => void;
  isDarkMode?: boolean;
  isPlaying?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  onPress,
  onPlayPress,
  onMenuPress,
  isDarkMode = false,
  isPlaying = false,
}) => {
  const artworkUrl =
    song.image?.[1]?.url ||
    song.image?.[0]?.url ||
    song.image?.[0]?.link;

  const artistName =
    song.artists?.primary?.[0]?.name ||
    song.primaryArtists ||
    'Unknown Artist';

  const duration = formatDuration(song.duration || 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.darkGray
            : Colors.lightGray,
          borderColor: isDarkMode
            ? Colors.darkBorder
            : Colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Album Art */}
        <Image
          source={
            artworkUrl
              ? { uri: artworkUrl }
              : { uri: 'https://via.placeholder.com/150' }
          }
          style={styles.artwork as any}
        />

        {/* Song Info */}
        <View style={styles.info}>
          <Text
            style={[
              styles.songName,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
            numberOfLines={1}
          >
            {song.name || 'Unknown Song'}
          </Text>

          <Text
            style={[
              styles.artistName,
              { color: isDarkMode ? Colors.gray : Colors.lightText },
            ]}
            numberOfLines={1}
          >
            {artistName} | {duration}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {isPlaying ? (
            <View style={styles.playingIndicator}>
              <Text style={{ color: Colors.primary }}>▶</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onPlayPress}
              style={styles.playButton}
            >
              <Feather
                name="play-circle"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
          >
            <Feather
              name="more-vertical"
              size={20}
              color={isDarkMode ? Colors.gray : Colors.lightText}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  songName: {
    ...Typography.bodyBold,
    marginBottom: Spacing.xs,
  },
  artistName: {
    ...Typography.small,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  playButton: {
    padding: Spacing.sm,
  },
  playingIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: Spacing.sm,
  },
});