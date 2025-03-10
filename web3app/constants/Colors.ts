/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const tintColorBlue = '#4da6ff';

export const Colors = {
  light: {
    text: '',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  blue: {
    text: '#11181C', // Light gray for text (high contrast on dark background)
    background: '#b3daff', // Ligh blue for active tab background
    tint: tintColorBlue, // Dark tint for active icon
    icon: 'white', // Medium gray for icons (neutral)
    tabIconDefault: 'white', // Medium gray for inactive tab icons
    tabIconSelected: '#b3daff', // Light blue for active tab icons
  },
};
