import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SongsScreen } from '../screens/SongsScreen';
import { ArtistsScreen } from '../screens/ArtistsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';

// Components + Store
import { MiniPlayer } from '../components/MiniPlayer';
import { usePlayerStore } from '../stores/playerStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Each stack reads theme from store at render time
const HomeStack = () => {
  const { isDarkMode } = usePlayerStore();
  const bg = isDarkMode ? '#000' : '#fff';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Songs" component={SongsScreen} />
      <Stack.Screen name="Artists" component={ArtistsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
};

const SongsStack = () => {
  const { isDarkMode } = usePlayerStore();
  const bg = isDarkMode ? '#000' : '#fff';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
      <Stack.Screen name="SongsScreen" component={SongsScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistsScreen} />
    </Stack.Navigator>
  );
};

const ArtistsStack = () => {
  const { isDarkMode } = usePlayerStore();
  const bg = isDarkMode ? '#000' : '#fff';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
      <Stack.Screen name="ArtistsScreen" component={ArtistsScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistsScreen} />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  const { isDarkMode } = usePlayerStore();
  const bg = isDarkMode ? '#000' : '#fff';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
      <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const { isDarkMode } = usePlayerStore();
  const bg = isDarkMode ? '#000' : '#fff';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

// Custom tab bar: MiniPlayer above tabs, both theme-aware
const CustomTabBar = (props: BottomTabBarProps) => {
  const { currentSong, isPlaying, togglePlayPause, nextSong, isDarkMode } = usePlayerStore();
  const navigation = useNavigation<any>();

  const handleMiniPlayerPress = () => {
    navigation.navigate('Home', { screen: 'Player' });
  };

  return (
    <View style={{ backgroundColor: isDarkMode ? Colors.darkGray : Colors.background }}>
      {currentSong && (
        <MiniPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPress={handleMiniPlayerPress}
          onPlayPress={() => togglePlayPause()}
          onNextPress={() => nextSong()}
          isDarkMode={isDarkMode}
        />
      )}
      <BottomTabBar {...props} />
    </View>
  );
};

export const RootNavigator = () => {
  const { isDarkMode } = usePlayerStore();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Songs') iconName = 'music';
          else if (route.name === 'Artists') iconName = 'users';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.darkGray : Colors.background,
          borderTopColor: isDarkMode ? Colors.darkBorder : Colors.border,
          borderTopWidth: 1,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500' as const,
          marginTop: 4,
          marginBottom: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Songs" component={SongsStack} />
      <Tab.Screen name="Artists" component={ArtistsStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};