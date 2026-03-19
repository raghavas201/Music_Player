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

export const SettingsScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark : Colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
          >
            Appearance
          </Text>

          <View
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={isDarkMode ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* Playback Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
          >
            Playback
          </Text>

          <View
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              Auto Play
            </Text>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={autoPlay ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
          >
            Notifications
          </Text>

          <View
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              Enable Notifications
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={notifications ? Colors.primary : Colors.gray}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? Colors.darkText : Colors.text },
            ]}
          >
            About
          </Text>

          <View
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              App Version
            </Text>
            <Text style={[styles.settingValue, { color: isDarkMode ? Colors.gray : Colors.lightText }]}>
              1.0.0
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              Privacy Policy
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color={isDarkMode ? Colors.gray : Colors.lightText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: isDarkMode ? Colors.darkGray : Colors.lightGray,
                borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
          >
            <Text style={[styles.settingLabel, { color: isDarkMode ? Colors.darkText : Colors.text }]}>
              Terms of Service
            </Text>
            <Feather
              name="chevron-right"
              size={20}
              color={isDarkMode ? Colors.gray : Colors.lightText}
            />
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
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  settingLabel: {
    ...Typography.body,
  },
  settingValue: {
    ...Typography.small,
  },
});
