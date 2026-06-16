import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getWeeklyReport, getStreaks } from '../../services/dashboard.service';
import { useTheme } from '../../hooks/useTheme';

export default function Progress() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const [weekly, setWeekly] = useState(null);
  const [streaks, setStreaks] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [w, s] = await Promise.all([getWeeklyReport(), getStreaks()]);
      setWeekly(w.data);
      setStreaks(s.data);
    } catch (err) {
      console.log('Progress error:', err.message);
    }
  };

  const maxSleep = weekly?.sleep ? Math.max(...weekly.sleep.map(s => s.duration || 0), 10) : 10;
  const maxHydration = weekly?.hydration ? Math.max(...weekly.hydration.map(h => h.total || 0), 2500) : 2500;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        <Text style={{ color: text, fontSize: 28, fontWeight: '800', marginBottom: 4 }}>📊 Progress</Text>
        <Text style={{ color: subtext, fontSize: 14, marginBottom: 24 }}>Your health journey overview</Text>

        {/* Streaks */}
        {streaks && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>🔥 CURRENT STREAKS</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[
                { label: 'Water', value: streaks.hydration, icon: '💧', color: '#00D4AA' },
                { label: 'Sleep', value: streaks.sleep, icon: '😴', color: '#6C63FF' },
                { label: 'Habits', value: streaks.habits, icon: '⚡', color: '#FFB300' },
                { label: 'Meals', value: streaks.nutrition, icon: '🥗', color: '#00C853' },
              ].map((s) => (
                <View key={s.label} style={{ alignItems: 'center' }}>
                  <View style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: `${s.color}15`,
                    justifyContent: 'center', alignItems: 'center', marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 24 }}>{s.icon}</Text>
                  </View>
                  <Text style={{ color: s.color, fontSize: 24, fontWeight: '800' }}>{s.value}</Text>
                  <Text style={{ color: subtext, fontSize: 11, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Weekly Averages */}
        {weekly?.averages && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>WEEKLY AVERAGES</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { label: 'Avg Sleep', value: `${weekly.averages.sleep}h`, color: '#6C63FF', icon: '😴' },
                { label: 'Avg Water', value: `${Math.round(weekly.averages.hydration / 100) / 10}L`, color: '#00D4AA', icon: '💧' },
                { label: 'Avg Cal', value: `${weekly.averages.calories}`, color: '#FFB300', icon: '🔥' },
              ].map((avg) => (
                <View key={avg.label} style={{
                  flex: 1, backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                  borderRadius: 16, padding: 14, alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 20, marginBottom: 6 }}>{avg.icon}</Text>
                  <Text style={{ color: avg.color, fontSize: 18, fontWeight: '800' }}>{avg.value}</Text>
                  <Text style={{ color: subtext, fontSize: 10, marginTop: 4, textAlign: 'center', fontWeight: '600' }}>{avg.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sleep Chart */}
        {weekly?.sleep && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>😴 SLEEP THIS WEEK</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 }}>
              {weekly.sleep.map((day, i) => {
                const h = day.duration ? (day.duration / maxSleep) * 80 : 4;
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
                    <Text style={{ color: subtext, fontSize: 9, marginTop: 6 }}>{day.date?.slice(5)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Hydration Chart */}
        {weekly?.hydration && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>💧 HYDRATION THIS WEEK</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100 }}>
              {weekly.hydration.map((day, i) => {
                const h = day.total ? (day.total / maxHydration) * 80 : 4;
                const isGoalMet = day.total >= day.goal;
                return (
                  <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{
                      width: '65%', height: h, borderRadius: 6,
                      backgroundColor: isGoalMet ? '#00D4AA' : isDark ? '#1E2A3A' : '#E2E8F4'
                    }} />
                    <Text style={{ color: subtext, fontSize: 9, marginTop: 6 }}>{day.date?.slice(5)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Habit Completion */}
        {weekly?.habits && weekly.habits.some(d => d.total > 0) && (
          <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 16, fontWeight: '700' }}>⚡ HABIT COMPLETION</Text>
            {weekly.habits.map((day, i) => {
              const pct = day.total > 0 ? (day.completed / day.total) * 100 : 0;
              return (
                <View key={i} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: subtext, fontSize: 12 }}>
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={{ color: '#6C63FF', fontSize: 12, fontWeight: '700' }}>
                      {day.completed}/{day.total}
                    </Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: isDark ? '#1E2A3A' : '#E2E8F4', borderRadius: 4 }}>
                    <View style={{ height: 8, width: `${pct}%`, backgroundColor: '#6C63FF', borderRadius: 4 }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}