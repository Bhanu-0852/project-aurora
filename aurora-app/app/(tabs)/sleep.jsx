import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { logSleep, getAnalytics } from '../../services/sleep.service';
import { useTheme } from '../../hooks/useTheme';

const durations = [5, 6, 7, 8, 9, 10];
const qualities = [
  { value: 1, label: '😞', desc: 'Poor' },
  { value: 2, label: '😕', desc: 'Fair' },
  { value: 3, label: '😐', desc: 'Okay' },
  { value: 4, label: '😊', desc: 'Good' },
  { value: 5, label: '😄', desc: 'Great' },
];

export default function Sleep() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [duration, setDuration] = useState(7);
  const [quality, setQuality] = useState(3);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.log('Sleep analytics error:', err.message);
    }
  };

  const handleLog = async () => {
    try {
      await logSleep({ duration, quality });
      await loadAnalytics();
      Alert.alert('✅ Logged!', `${duration} hours of sleep recorded.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to log sleep');
    }
  };

  const maxDuration = analytics?.history
    ? Math.max(...analytics.history.map(s => s.duration || 0), 10)
    : 10;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        <Text style={{ color: text, fontSize: 28, fontWeight: '800', marginBottom: 4 }}>😴 Sleep</Text>
        <Text style={{ color: subtext, fontSize: 14, marginBottom: 28 }}>Track and improve your sleep patterns</Text>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[
            {
              label: 'LAST NIGHT',
              value: analytics?.lastNight?.duration ? `${analytics.lastNight.duration}h` : '--',
              color: '#6C63FF', icon: '😴'
            },
            {
              label: 'WEEKLY AVG',
              value: analytics?.avgDuration ? `${analytics.avgDuration}h` : '--',
              color: '#00D4AA', icon: '📊'
            }
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: card, borderRadius: 20, padding: 20,
              borderWidth: 1, borderColor: border, alignItems: 'center'
            }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</Text>
              <Text style={{ color: subtext, fontSize: 10, letterSpacing: 1, marginBottom: 4, fontWeight: '700' }}>{stat.label}</Text>
              <Text style={{ color: stat.color, fontSize: 28, fontWeight: '800' }}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        {analytics?.history && analytics.history.length > 0 && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>LAST 7 NIGHTS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 }}>
              {analytics.history.slice(0, 7).reverse().map((day, i) => {
                const h = day.duration ? (day.duration / maxDuration) * 80 : 4;
                const isGood = day.duration >= 7;
                return (
                  <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: isGood ? '#6C63FF' : subtext, fontSize: 9, marginBottom: 4 }}>
                      {day.duration ? `${day.duration}h` : ''}
                    </Text>
                    <View style={{
                      width: '65%', height: h, borderRadius: 6,
                      backgroundColor: isGood ? '#6C63FF' : isDark ? '#1E2A3A' : '#E2E8F4'
                    }} />
                    <Text style={{ color: subtext, fontSize: 9, marginTop: 6 }}>
                      {day.date?.slice(5)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Log Sleep */}
        <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
          <Text style={{ color: text, fontSize: 17, fontWeight: '800', marginBottom: 20 }}>Log Last Night's Sleep</Text>

          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>DURATION (HOURS)</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
            {durations.map((d) => (
              <TouchableOpacity key={d} onPress={() => setDuration(d)} style={{
                flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
                backgroundColor: duration === d ? '#6C63FF' : isDark ? '#1E2A3A' : '#F0F4FF'
              }}>
                <Text style={{ color: duration === d ? '#FFFFFF' : subtext, fontWeight: '700', fontSize: 14 }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>SLEEP QUALITY</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            {qualities.map((q) => (
              <TouchableOpacity key={q.value} onPress={() => setQuality(q.value)} style={{
                width: 56, height: 64, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
                backgroundColor: quality === q.value ? '#6C63FF' : isDark ? '#1E2A3A' : '#F0F4FF',
                borderWidth: quality === q.value ? 2 : 1,
                borderColor: quality === q.value ? '#6C63FF' : border
              }}>
                <Text style={{ fontSize: 24 }}>{q.label}</Text>
                <Text style={{ color: quality === q.value ? '#FFFFFF' : subtext, fontSize: 9, marginTop: 4, fontWeight: '600' }}>
                  {q.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleLog} style={{
            backgroundColor: '#6C63FF', borderRadius: 16, padding: 16, alignItems: 'center',
            shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6
          }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Log Sleep</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}