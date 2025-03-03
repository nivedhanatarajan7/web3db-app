import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AlertProvider } from './AlertContext';
import { AuthProvider, useAuth } from './AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './login';
import { useFonts, Roboto_400Regular } from "@expo-google-fonts/roboto";
SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { walletInfo } = useAuth(); 

  if (!walletInfo.connected) {
    return <LoginScreen />; 
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
      <Stack.Screen name="DataTypeScreen"/>

    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
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
