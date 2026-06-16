import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';

export default function HabitCard({ completed = 0, total = 0 }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const card = isDark ? '#141927' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A2E';
  const subtext = isDark ? '#8B9CB6' : '#666B8A';
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/habits')} style={{
      flex: 1, backgroundColor: card, borderRadius: 20, padding: 20
    }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
      <Text style={{ color: subtext, fontSize: 12, marginBottom: 4 }}>HABITS</Text>
      <Text style={{ color: text, fontSize: 20, fontWeight: 'bold' }}>{completed}/{total}</Text>
      <Text style={{ color: subtext, fontSize: 12, marginTop: 2 }}>done today</Text>
      <View style={{ height: 4, backgroundColor: isDark ? '#1E2A3A' : '#E8ECF4', borderRadius: 2, marginTop: 12 }}>
        <View style={{ height: 4, width: `${pct}%`, backgroundColor: '#6C63FF', borderRadius: 2 }} />
      </View>
    </TouchableOpacity>
  );
}