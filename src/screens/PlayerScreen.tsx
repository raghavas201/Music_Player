import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usePlayerStore } from '../stores/playerStore';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';

const { width } = Dimensions.get('window');
const SEEK_BAR_WIDTH = width - Spacing.lg * 2;

export const PlayerScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
}) => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    duration,
    position,
    seek,
    shuffle,
    toggleShuffle,
    repeat,
    setRepeat,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    nextSong,
    previousSong,
    isDarkMode,
  } = usePlayerStore();

  const song = currentSong;
  const isFav = song ? isFavorite(song.id) : false;

  // ── Seek bar via PanResponder ──────────────────────────────────────────────
  const seekBarRef = useRef<View>(null);

  const seekPan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const x = evt.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / SEEK_BAR_WIDTH));
      seek(ratio * duration);
    },
    onPanResponderMove: (evt) => {
      const x = evt.nativeEvent.locationX;
      const ratio = Math.max(0, Math.min(1, x / SEEK_BAR_WIDTH));
      seek(ratio * duration);
    },
  });

  const progress = duration > 0 ? position / duration : 0;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFavorite = () => {
    if (!song) return;
    if (isFav) removeFromFavorites(song.id);
    else addToFavorites(song);
  };

  const handleRepeat = () => {
    const next = repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off';
    setRepeat(next);
  };

  const artworkUrl = song?.image?.[1]?.url || song?.image?.[0]?.url || song?.image?.[0]?.link;
  const artistName = song?.artists?.primary?.[0]?.name || song?.primaryArtists || 'Unknown';

  if (!song) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No song selected</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-down" size={24} color={Colors.darkText} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark : Colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="chevron-down" size={24} color={Colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Now Playing</Text>
        <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="more-vertical" size={24} color={Colors.darkText} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artworkContainer}>
        <Image
          source={artworkUrl ? { uri: artworkUrl } : { uri: 'https://via.placeholder.com/300' }}
          style={styles.artwork}
        />
      </View>

      {/* Song Info + Favorite */}
      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={styles.songName} numberOfLines={1}>{song.name}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
        </View>
        <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather
            name="heart"
            size={22}
            color={isFav ? Colors.primary : Colors.gray}
          />
        </TouchableOpacity>
      </View>

      {/* Progress / Seek Bar */}
      <View style={styles.progressContainer}>
        <View
          ref={seekBarRef}
          style={styles.seekBarTrack}
          {...seekPan.panHandlers}
        >
          <View style={[styles.seekBarFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.seekBarThumb, { left: `${progress * 100}%` as any }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.sideControl}>
          <Feather
            name="shuffle"
            size={20}
            color={shuffle ? Colors.primary : Colors.gray}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => previousSong()} style={styles.skipControl}>
          <Feather name="skip-back" size={26} color={Colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => togglePlayPause()}
        >
          <Feather name={isPlaying ? 'pause' : 'play'} size={34} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => nextSong()} style={styles.skipControl}>
          <Feather name="skip-forward" size={26} color={Colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRepeat} style={styles.sideControl}>
          <View>
            <Feather
              name="repeat"
              size={20}
              color={repeat !== 'off' ? Colors.primary : Colors.gray}
            />
            {repeat === 'one' && (
              <Text style={styles.repeatOneBadge}>1</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="list" size={20} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="share-2" size={20} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="download" size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.gray,
    ...Typography.body,
  },
  backBtn: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.bodyBold,
    color: Colors.darkText,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  artwork: {
    width: width - Spacing.xl * 2,
    height: width - Spacing.xl * 2,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.darkGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  infoText: {
    flex: 1,
    marginRight: Spacing.md,
  },
  songName: {
    ...Typography.h4,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  artistName: {
    ...Typography.body,
    color: Colors.gray,
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  seekBarTrack: {
    height: 4,
    backgroundColor: Colors.darkGray,
    borderRadius: 2,
    marginBottom: Spacing.sm,
    position: 'relative',
    justifyContent: 'center',
  },
  seekBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  seekBarThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.darkText,
    marginLeft: -7,
    top: -5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  time: {
    ...Typography.xsmall,
    color: Colors.gray,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  sideControl: {
    padding: Spacing.md,
    width: 52,
    alignItems: 'center',
  },
  skipControl: {
    padding: Spacing.md,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatOneBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
  },
});
