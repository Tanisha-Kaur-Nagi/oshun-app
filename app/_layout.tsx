import { Stack } from 'expo-router';
import { AppProvider, useApp } from '../src/context/AppContext';
import LoginScreen from '../src/screens/LoginScreen';
import SplashScreen from '../src/screens/SplashScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading, handleLogin } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="focus-mode-selection" />
      <Stack.Screen name="active-focus" />
      <Stack.Screen name="app-selection" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="goal-settings" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
});
