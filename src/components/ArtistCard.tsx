import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Artist } from '../types';
import { Colors, Spacing, BorderRadius, Typography } from '../utils/colors';

interface ArtistCardProps {
  artist: Artist;
  onPress: () => void;
  onMenuPress: () => void;
  isDarkMode?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onPress,
  onMenuPress,
  isDarkMode = false,
  variant = 'horizontal',
}) => {
  const imageUrl = artist.image?.[0]?.url || artist.image?.[0]?.link;

  if (variant === 'vertical') {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.verticalContainer}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.verticalImage}
        />
        <Text
          style={[
            styles.artistName,
            { color: isDarkMode ? Colors.darkText : Colors.text },
          ]}
          numberOfLines={1}
        >
          {artist.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
          borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Artist Image */}
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />

        {/* Artist Info */}
        <View style={styles.info}>
          <Text
            style={[
              styles.nameText,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
            numberOfLines={1}
          >
            {artist.name}
          </Text>
          <Text
            style={[
              styles.statsText,
              { color: isDarkMode ? Colors.gray : Colors.lightText },
            ]}
            numberOfLines={1}
          >
            {artist.albumCount || 0} Album | {artist.songCount || 0} Songs
          </Text>
        </View>

        {/* Menu Button */}
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Feather
            name="more-vertical"
            size={20}
            color={isDarkMode ? Colors.gray : Colors.lightText}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  verticalContainer: {
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
  },
  verticalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
  },
  info: {
    flex: 1,
  },
  nameText: {
    ...Typography.bodyBold,
    marginBottom: Spacing.xs,
  },
  statsText: {
    ...Typography.small,
  },
  artistName: {
    ...Typography.small,
    textAlign: 'center',
  },
  menuButton: {
    padding: Spacing.sm,
  },
});
