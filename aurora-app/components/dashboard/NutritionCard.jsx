import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';

export default function NutritionCard({ calories = 0 }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const card = isDark ? '#141927' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A2E';
  const subtext = isDark ? '#8B9CB6' : '#666B8A';

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/nutrition')} style={{
      flex: 1, backgroundColor: card, borderRadius: 20, padding: 20
    }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>🥗</Text>
      <Text style={{ color: subtext, fontSize: 12, marginBottom: 4 }}>CALORIES</Text>
      <Text style={{ color: text, fontSize: 20, fontWeight: 'bold' }}>{calories}</Text>
      <Text style={{ color: subtext, fontSize: 12, marginTop: 2 }}>kcal today</Text>
    </TouchableOpacity>
  );
}