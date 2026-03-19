import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { usePlayerStore } from './src/stores/playerStore';

export default function App() {
  const { loadState } = usePlayerStore();

  useEffect(() => {
    try {
      loadState();
    } catch (e) {
      console.log('Zustand load error:', e);
    }
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}