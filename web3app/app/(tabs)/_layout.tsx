import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Icon } from 'react-native-paper'
import BloodPressureScreen from '../bp';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
/*         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
 */
        tabBarActiveTintColor: Colors['blue'].tint,
        tabBarInactiveBackgroundColor: 'white',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          color: Colors['blue'].text, // Set the text color for the tabs
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor: Colors['blue'].background,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color }) => <Icon source="home" size={30} color={color}/>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon source="star" size={30} color={color}/>
        }}
      />
      <Tabs.Screen
        name="home-assistant"
        options={{
          title: 'Home Assistant',
          tabBarIcon: ({ color }) => <Icon source="assistant" size={30} color={color}/>
        }}
      />
    </Tabs>
  );
}
