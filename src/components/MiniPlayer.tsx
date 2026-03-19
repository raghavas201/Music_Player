import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Song } from '../types';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';

interface MiniPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  onPress: () => void;
  onPlayPress: () => void;
  onNextPress: () => void;
  isDarkMode?: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  song,
  isPlaying,
  onPress,
  onPlayPress,
  onNextPress,
  isDarkMode = false,
}) => {
  // Prevent crash if no song
  if (!song) return null;

  const artworkUrl =
    song.image?.[0]?.url || song.image?.[0]?.link;

  const artistName =
    song.artists?.primary?.[0]?.name ||
    song.primaryArtists ||
    'Unknown';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
          borderTopColor: isDarkMode ? Colors.darkBorder : Colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Album Art */}
        <Image
          source={
            artworkUrl
              ? { uri: artworkUrl }
              : { uri: 'https://via.placeholder.com/100' }
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
            {song?.name || 'Unknown'}
          </Text>

          <Text
            style={[
              styles.artistName,
              { color: isDarkMode ? Colors.gray : Colors.lightText },
            ]}
            numberOfLines={1}
          >
            {artistName}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={onPlayPress}
            style={styles.controlButton}
          >
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNextPress}
            style={styles.controlButton}
          >
            <Feather
              name="skip-forward"
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'android' ? Spacing.md : Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  songName: {
    ...Typography.small,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  artistName: {
    ...Typography.xsmall,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  controlButton: {
    padding: Spacing.sm,
  },
});