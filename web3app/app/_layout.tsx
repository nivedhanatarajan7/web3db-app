import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AlertProvider } from './AlertContext'; // Adjust the path as needed
import { AuthProvider, useAuth } from './AuthContext'; // Ensure correct path to AuthProvider
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './login'; // Import LoginScreen

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { walletInfo } = useAuth(); // Get auth state

  if (!walletInfo.connected) {
    return <LoginScreen />; // Show login screen if not authenticated
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="heart" />
      <Stack.Screen name="bp" />
      <Stack.Screen name="exercise" />
      <Stack.Screen name="sleep" />
      <Stack.Screen name="resprate" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AppNavigation />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
