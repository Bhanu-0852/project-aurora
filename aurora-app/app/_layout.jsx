import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import useAppStore from '../store/useStore';

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const theme = useAppStore((state) => state.theme);
  const activeScheme = theme === 'system' ? systemScheme : theme;

  return (
    <>
      <StatusBar style={activeScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}