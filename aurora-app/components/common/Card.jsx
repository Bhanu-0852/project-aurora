import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function Card({ children, style = {}, padding = 20 }) {
  const { card, border, isDark } = useTheme();
  return (
    <View style={[{
      backgroundColor: card, borderRadius: 20, padding,
      borderWidth: 1, borderColor: border,
      shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 10, elevation: 3, marginBottom: 12
    }, style]}>
      {children}
    </View>
  );
}