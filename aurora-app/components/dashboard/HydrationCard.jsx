import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';

export default function HydrationCard({ total = 0, goal = 2500 }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const card = isDark ? '#141927' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A2E';
  const subtext = isDark ? '#8B9CB6' : '#666B8A';
  const pct = Math.min((total / goal) * 100, 100);

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/hydration')} style={{
      flex: 1, backgroundColor: card, borderRadius: 20, padding: 20
    }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>💧</Text>
      <Text style={{ color: subtext, fontSize: 12, marginBottom: 4 }}>HYDRATION</Text>
      <Text style={{ color: text, fontSize: 20, fontWeight: 'bold' }}>
        {Math.round(total / 100) / 10}L
      </Text>
      <Text style={{ color: subtext, fontSize: 12, marginTop: 2 }}>of {goal / 1000}L goal</Text>
      <View style={{ height: 4, backgroundColor: isDark ? '#1E2A3A' : '#E8ECF4', borderRadius: 2, marginTop: 12 }}>
        <View style={{ height: 4, width: `${pct}%`, backgroundColor: '#00D4AA', borderRadius: 2 }} />
      </View>
    </TouchableOpacity>
  );
}