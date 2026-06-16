import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SleepChart({ data = [] }) {
  const { card, subtext, isDark, border } = useTheme();
  const maxDuration = Math.max(...data.map(d => d.duration || 0), 10);

  return (
    <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: border }}>
      <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>LAST 7 NIGHTS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 }}>
        {data.slice(0, 7).map((day, i) => {
          const h = day.duration ? (day.duration / maxDuration) * 80 : 4;
          const isGood = day.duration >= 7;
          return (
            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ color: isGood ? '#6C63FF' : subtext, fontSize: 9, marginBottom: 4 }}>
                {day.duration ? `${day.duration}h` : ''}
              </Text>
              <View style={{ width: '65%', height: h, borderRadius: 6, backgroundColor: isGood ? '#6C63FF' : isDark ? '#1E2A3A' : '#E2E8F4' }} />
              <Text style={{ color: subtext, fontSize: 9, marginTop: 6 }}>{day.date?.slice(5)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}