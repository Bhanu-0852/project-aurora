import { useColorScheme } from 'react-native';
import useAppStore from '../store/useStore';
import { Colors } from '../constants/colors';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const theme = useAppStore((state) => state.theme);
  const activeScheme = theme === 'system' ? systemScheme : theme;
  const isDark = activeScheme === 'dark';
  const c = isDark ? Colors.dark : Colors.light;

  return {
    isDark,
    bg: c.bg,
    card: c.card,
    cardElevated: c.cardElevated,
    border: c.border,
    text: c.text,
    subtext: c.subtext,
    input: c.input,
    placeholder: c.placeholder,
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    accent: Colors.accent,
    warning: Colors.warning,
    error: Colors.error,
    success: Colors.success,
  };
};