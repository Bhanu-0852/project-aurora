import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function InsightCard({ insight = '' }) {
  if (!insight) return null;
  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/companion')} style={{ marginBottom: 16 }}>
      <LinearGradient colors={['#6C63FF', '#8B85FF']} style={{ borderRadius: 20, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
            <Text style={{ fontSize: 14 }}>✦</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 2, fontWeight: '700' }}>DAILY INSIGHT</Text>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 22 }}>{insight}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 10 }}>Ask Aurora for more →</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}