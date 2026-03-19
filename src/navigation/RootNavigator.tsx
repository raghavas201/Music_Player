import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../utils/colors';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SongsScreen } from '../screens/SongsScreen';
import { ArtistsScreen } from '../screens/ArtistsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const commonOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#1A1A1A' },
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={commonOptions}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Songs" component={SongsScreen} />
    <Stack.Screen name="Artists" component={ArtistsScreen} />
    <Stack.Screen name="Player" component={PlayerScreen} />
  </Stack.Navigator>
);

const SongsStack = () => (
  <Stack.Navigator screenOptions={commonOptions}>
    <Stack.Screen name="SongsScreen" component={SongsScreen} />
    <Stack.Screen name="Player" component={PlayerScreen} />
    <Stack.Screen name="ArtistDetail" component={ArtistsScreen} />
  </Stack.Navigator>
);

const ArtistsStack = () => (
  <Stack.Navigator screenOptions={commonOptions}>
    <Stack.Screen name="ArtistsScreen" component={ArtistsScreen} />
    <Stack.Screen name="ArtistDetail" component={ArtistsScreen} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={commonOptions}>
    <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
    <Stack.Screen name="Player" component={PlayerScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={commonOptions}>
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  return (
    <Tab.Navigator
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
          backgroundColor: Colors.darkGray,
          borderTopColor: Colors.darkBorder,
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