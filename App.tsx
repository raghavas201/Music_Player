import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as NavigationBar from 'expo-navigation-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { usePlayerStore } from './src/stores/playerStore';

export default function App() {
  const { loadState, isDarkMode } = usePlayerStore();

  // Background audio on startup
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(e => console.warn('Audio mode setup error:', e));

    try { loadState(); } catch (e) { console.log('Zustand load error:', e); }
  }, []);

  // Sync Android system navigation bar with dark/light theme
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(isDarkMode ? '#121212' : '#ffffff').catch(() => {});
    NavigationBar.setButtonStyleAsync(isDarkMode ? 'light' : 'dark').catch(() => {});
  }, [isDarkMode]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}