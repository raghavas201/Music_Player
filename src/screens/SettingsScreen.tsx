import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../utils/colors';
import { usePlayerStore } from '../stores/playerStore';

export const SettingsScreen: React.FC = () => {
  // Global dark mode from store — changes affect the ENTIRE app
  const { isDarkMode, toggleDarkMode } = usePlayerStore();
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const bg = isDarkMode ? Colors.dark : Colors.background;
  const cardBg = isDarkMode ? Colors.darkGray : Colors.lightGray;
  const cardBorder = isDarkMode ? Colors.darkBorder : Colors.border;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const subColor = isDarkMode ? Colors.gray : Colors.lightText;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>

          <View style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name={isDarkMode ? 'moon' : 'sun'} size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={isDarkMode ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* Playback */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Playback</Text>

          <View style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="play-circle" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Auto Play</Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={autoPlay ? Colors.primary : Colors.gray}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="headphones" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Audio Quality</Text>
            </View>
            <Text style={[styles.settingValue, { color: subColor }]}>320 kbps</Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>

          <View style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Enable Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={notifications ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>

          <View style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="info" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>App Version</Text>
            </View>
            <Text style={[styles.settingValue, { color: subColor }]}>1.0.0</Text>
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="shield" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={subColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.settingLeft}>
              <Feather name="file-text" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Terms of Service</Text>
            </View>
            <Feather name="chevron-right" size={20} color={subColor} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.h4,
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 10,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.body,
  },
  settingValue: {
    ...Typography.small,
  },
});
