import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Slider,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Song } from '../types';
import { usePlayerStore } from '../stores/playerStore';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';

const { width } = Dimensions.get('window');

export const PlayerScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const song = route.params?.song || null;
  const [isDarkMode] = useState(true);
  
  const {
    isPlaying,
    setIsPlaying,
    duration,
    position,
    setPosition,
    shuffle,
    toggleShuffle,
    repeat,
    setRepeat,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    nextSong,
    previousSong,
  } = usePlayerStore();

  const isFav = song && isFavorite(song.id);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFavorite = () => {
    if (song) {
      if (isFav) {
        removeFromFavorites(song.id);
      } else {
        addToFavorites(song);
      }
    }
  };

  const handleRepeat = () => {
    const nextRepeat = repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off';
    setRepeat(nextRepeat);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const artworkUrl = song?.image?.[0]?.url || song?.image?.[0]?.link;
  const artistName = song?.artists?.primary?.[0]?.name || song?.primaryArtists || 'Unknown';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark : Colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-down"
            size={24}
            color={isDarkMode ? Colors.darkText : Colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {/* Show more options */}}>
          <Feather
            name="more-vertical"
            size={24}
            color={isDarkMode ? Colors.darkText : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Album Art */}
        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: artworkUrl }}
            style={styles.artwork}
          />
        </View>

        {/* Song Info */}
        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.songName,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
          >
            {song?.name}
          </Text>
          <Text
            style={[
              styles.artistName,
              { color: isDarkMode ? Colors.gray : Colors.lightText },
            ]}
          >
            {artistName}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 100}
            value={position || 0}
            onValueChange={setPosition}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={isDarkMode ? Colors.darkGray : Colors.lightGray}
          />
          <View style={styles.timeContainer}>
            <Text style={[styles.time, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
              {formatTime(position || 0)}
            </Text>
            <Text style={[styles.time, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
              {formatTime(duration || 0)}
            </Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={previousSong}>
            <Feather name="skip-back" size={20} color={isDarkMode ? Colors.darkText : Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Feather name="rotate-ccw" size={20} color={isDarkMode ? Colors.darkText : Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: Colors.primary }]}
            onPress={handlePlayPause}
          >
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Feather name="rotate-cw" size={20} color={isDarkMode ? Colors.darkText : Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={nextSong}>
            <Feather name="skip-forward" size={20} color={isDarkMode ? Colors.darkText : Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          <TouchableOpacity onPress={() => {/* Show lyrics */}}>
            <Feather name="help-circle" size={20} color={isDarkMode ? Colors.gray : Colors.lightText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {/* Show timer */}}>
            <Feather name="clock" size={20} color={isDarkMode ? Colors.gray : Colors.lightText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {/* Show queue */}}>
            <Feather name="list" size={20} color={isDarkMode ? Colors.gray : Colors.lightText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFavorite}>
            <Feather
              name="more-vertical"
              size={20}
              color={isDarkMode ? Colors.gray : Colors.lightText}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Bottom Controls */}
      <View
        style={[
          styles.bottomControls,
          {
            backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
            borderTopColor: isDarkMode ? Colors.darkBorder : Colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleFavorite}>
          <Feather
            name={isFav ? 'heart' : 'heart'}
            size={20}
            color={isFav ? Colors.primary : (isDarkMode ? Colors.gray : Colors.lightText)}
            fill={isFav ? Colors.primary : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleShuffle}>
          <Feather
            name="shuffle"
            size={20}
            color={shuffle ? Colors.primary : (isDarkMode ? Colors.gray : Colors.lightText)}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRepeat}>
          <Feather
            name={repeat === 'one' ? 'repeat-1' : 'repeat'}
            size={20}
            color={repeat !== 'off' ? Colors.primary : (isDarkMode ? Colors.gray : Colors.lightText)}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {/* Download */}}>
          <Feather
            name="download"
            size={20}
            color={isDarkMode ? Colors.gray : Colors.lightText}
          />
        </TouchableOpacity>
      </View>
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
    paddingTop: Spacing.xl,
  },
  content: {
    flex: 1,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  artwork: {
    width: width - Spacing.xl * 2,
    height: width - Spacing.xl * 2,
    borderRadius: BorderRadius.xl,
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  songName: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  artistName: {
    ...Typography.body,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  slider: {
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    ...Typography.small,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  controlButton: {
    padding: Spacing.md,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
});
