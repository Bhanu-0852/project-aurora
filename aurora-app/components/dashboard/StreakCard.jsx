import { View, Text, TouchableOpacity} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';

export default function StreakCard({ streaks = {} }) {
  const { isDark, card, text, subtext } = useTheme();

  const items = [
    { label: 'Water', value: streaks.hydration || 0, icon: '💧', color: '#00D4AA' },
    { label: 'Sleep', value: streaks.sleep || 0, icon: '😴', color: '#6C63FF' },
    { label: 'Habits', value: streaks.habits || 0, icon: '⚡', color: '#FFB300' },
    { label: 'Meals', value: streaks.nutrition || 0, icon: '🥗', color: '#FF6B6B' },
  ];

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/progress')} style={{
      backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 12
    }}>
      <Text style={{ color: subtext, fontSize: 12, letterSpacing: 1, marginBottom: 16 }}>🔥 STREAKS</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {items.map((s) => (
          <View key={s.label} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>{s.icon}</Text>
            <Text style={{ color: s.color, fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>{s.value}</Text>
            <Text style={{ color: subtext, fontSize: 11, marginTop: 2 }}>{s.label}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}