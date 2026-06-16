import { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getSummary, getDailyInsight, getStreaks } from '../../services/dashboard.service';
import useAppStore from '../../store/useStore';
import { useTheme } from '../../hooks/useTheme';
import AnimatedNumber from '../../components/common/AnimatedNumber';
import { HomeSkeleton } from '../../components/common/SkeletonLoader';

const calculateHealthScore = (summary) => {
  if (!summary) return 0;
  let score = 0;
  const hydrationPct = summary.hydration.total / summary.hydration.goal;
  score += Math.min(hydrationPct * 30, 30);
  if (summary.sleep.duration >= 8) score += 25;
  else if (summary.sleep.duration >= 7) score += 22;
  else if (summary.sleep.duration >= 6) score += 14;
  else if (summary.sleep.duration > 0) score += 6;
  if (summary.habits.total > 0) {
    score += (summary.habits.completed / summary.habits.total) * 25;
  }
  if (summary.nutrition.calories > 0) score += 20;
  return Math.round(Math.min(score, 100));
};

const getScoreLabel = (score) => {
  if (score >= 90) return { label: 'Excellent! 🌟', color: '#00D4AA' };
  if (score >= 70) return { label: 'Great! 💪', color: '#6C63FF' };
  if (score >= 50) return { label: 'Good 👍', color: '#FFB300' };
  if (score >= 30) return { label: 'Fair 🌱', color: '#FF8C00' };
  return { label: 'Just Starting ✦', color: '#8B85FF' };
};

export default function Home() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const { user } = useAppStore();
  const [summary, setSummary] = useState(null);
  const [insight, setInsight] = useState('');
  const [streaks, setStreaks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const loadData = async () => {
    try {
      const [s, i, st] = await Promise.all([
        getSummary(), getDailyInsight(), getStreaks()
      ]);
      setSummary(s.data);
      setInsight(i.data.insight);
      setStreaks(st.data);
      const score = calculateHealthScore(s.data);
      Animated.timing(scoreAnim, {
        toValue: score,
        duration: 1400,
        useNativeDriver: false,
      }).start();
    } catch (err) {
      console.log('Dashboard error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const greetingIcon = hour < 12 ? 'sunny' : hour < 18 ? 'partly-sunny' : 'moon';

  const healthScore = calculateHealthScore(summary);
  const scoreInfo = getScoreLabel(healthScore);
  const hydrationPct = summary ? Math.min((summary.hydration.total / summary.hydration.goal) * 100, 100) : 0;
  const sleepPct = summary?.sleep?.duration ? Math.min((summary.sleep.duration / 9) * 100, 100) : 0;
  const habitPct = summary?.habits?.total > 0
    ? (summary.habits.completed / summary.habits.total) * 100 : 0;

  if (loading) return <View style={{ flex: 1, backgroundColor: bg }}><HomeSkeleton /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={isDark ? ['#0E1422', '#141927'] : ['#F0EEFF', '#F5F7FF']}
          style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Ionicons name={greetingIcon} size={14} color={subtext} />
                <Text style={{ color: subtext, fontSize: 13 }}>{greeting}</Text>
              </View>
              <Text style={{ color: text, fontSize: 26, fontWeight: '800' }}>
                {user?.name?.split(' ')[0] || 'Friend'} 👋
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/profile');
              }}
              style={{
                width: 46, height: 46, borderRadius: 23,
                backgroundColor: card, justifyContent: 'center', alignItems: 'center',
                borderWidth: 1, borderColor: border,
                shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3
              }}
            >
              <Ionicons name="person-outline" size={20} color={subtext} />
            </TouchableOpacity>
          </View>

          {/* Health Score Card */}
          <View style={{
            backgroundColor: card, borderRadius: 24, padding: 20,
            borderWidth: 1, borderColor: border,
            shadowColor: '#6C63FF', shadowOpacity: isDark ? 0.15 : 0.08,
            shadowRadius: 16, elevation: 6
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: 8 }}>
                  TODAY'S HEALTH SCORE
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <AnimatedNumber
                    value={healthScore}
                    duration={1400}
                    style={{ color: scoreInfo.color, fontSize: 56, fontWeight: '800' }}
                  />
                  <Text style={{ color: subtext, fontSize: 18, fontWeight: '600' }}>/100</Text>
                </View>
                <Text style={{ color: scoreInfo.color, fontSize: 14, fontWeight: '700' }}>
                  {scoreInfo.label}
                </Text>
              </View>

              {/* Score ring visual */}
              <View style={{
                width: 88, height: 88, borderRadius: 44,
                borderWidth: 6,
                borderColor: `${scoreInfo.color}20`,
                justifyContent: 'center', alignItems: 'center',
                backgroundColor: `${scoreInfo.color}10`
              }}>
                <View style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: scoreInfo.color,
                  justifyContent: 'center', alignItems: 'center',
                  shadowColor: scoreInfo.color, shadowOpacity: 0.5,
                  shadowRadius: 12, elevation: 8
                }}>
                  <Ionicons name="heart" size={28} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Score breakdown bars */}
            <View style={{ marginTop: 16, gap: 8 }}>
              {[
                { label: 'Hydration', pct: hydrationPct, color: '#00D4AA' },
                { label: 'Sleep', pct: sleepPct, color: '#6C63FF' },
                { label: 'Habits', pct: habitPct, color: '#FFB300' },
              ].map((item) => (
                <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ color: subtext, fontSize: 11, width: 60, fontWeight: '600' }}>{item.label}</Text>
                  <View style={{ flex: 1, height: 6, backgroundColor: isDark ? '#1E2A3A' : '#E8ECF4', borderRadius: 3 }}>
                    <View style={{
                      height: 6, width: `${item.pct}%`,
                      backgroundColor: item.color, borderRadius: 3
                    }} />
                  </View>
                  <Text style={{ color: item.color, fontSize: 11, fontWeight: '700', width: 32, textAlign: 'right' }}>
                    {Math.round(item.pct)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Insight Card */}
          {insight ? (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/companion');
              }}
              style={{ marginBottom: 16, marginTop: 16 }}
            >
              <LinearGradient colors={['#6C63FF', '#8B85FF']} style={{ borderRadius: 20, padding: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    justifyContent: 'center', alignItems: 'center', marginRight: 8
                  }}>
                    <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 2, fontWeight: '700' }}>
                    AI INSIGHT
                  </Text>
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 22, marginBottom: 10 }}>{insight}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Ask Aurora for more</Text>
                  <Ionicons name="arrow-forward" size={12} color="rgba(255,255,255,0.6)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : <View style={{ height: 16 }} />}

          {/* Stats Grid */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            {[
              {
                icon: 'water', label: 'HYDRATION', color: '#00D4AA',
                value: summary ? `${(summary.hydration.total / 1000).toFixed(1)}L` : '0L',
                sub: `of ${summary ? summary.hydration.goal / 1000 : 2.5}L`,
                pct: hydrationPct, route: '/(tabs)/hydration'
              },
              {
                icon: 'moon', label: 'SLEEP', color: '#6C63FF',
                value: summary?.sleep?.duration ? `${summary.sleep.duration}h` : '--',
                sub: 'last night',
                pct: sleepPct, route: '/(tabs)/sleep'
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(item.route);
                }}
                style={{
                  flex: 1, backgroundColor: card, borderRadius: 20, padding: 18,
                  borderWidth: 1, borderColor: border,
                  shadowColor: '#000', shadowOpacity: isDark ? 0.2 : 0.05, shadowRadius: 8, elevation: 2
                }}
              >
                <View style={{
                  width: 38, height: 38, borderRadius: 12,
                  backgroundColor: `${item.color}15`,
                  justifyContent: 'center', alignItems: 'center', marginBottom: 12
                }}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={{ color: subtext, fontSize: 10, letterSpacing: 1.5, marginBottom: 4, fontWeight: '700' }}>
                  {item.label}
                </Text>
                <Text style={{ color: text, fontSize: 22, fontWeight: '800', marginBottom: 2 }}>
                  {item.value}
                </Text>
                <Text style={{ color: subtext, fontSize: 11, marginBottom: 10 }}>{item.sub}</Text>
                <View style={{ height: 4, backgroundColor: isDark ? '#1E2A3A' : '#E8ECF4', borderRadius: 2 }}>
                  <View style={{ height: 4, width: `${item.pct}%`, backgroundColor: item.color, borderRadius: 2 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            {[
              {
                icon: 'flash', label: 'HABITS', color: '#6C63FF',
                value: summary ? `${summary.habits.completed}/${summary.habits.total}` : '0/0',
                sub: 'done today', pct: habitPct, route: '/(tabs)/habits'
              },
              {
                icon: 'restaurant', label: 'CALORIES', color: '#FFB300',
                value: summary?.nutrition?.calories ? `${summary.nutrition.calories}` : '0',
                sub: 'kcal logged', pct: summary?.nutrition?.calories ? 100 : 0,
                route: '/(tabs)/nutrition'
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(item.route);
                }}
                style={{
                  flex: 1, backgroundColor: card, borderRadius: 20, padding: 18,
                  borderWidth: 1, borderColor: border,
                  shadowColor: '#000', shadowOpacity: isDark ? 0.2 : 0.05, shadowRadius: 8, elevation: 2
                }}
              >
                <View style={{
                  width: 38, height: 38, borderRadius: 12,
                  backgroundColor: `${item.color}15`,
                  justifyContent: 'center', alignItems: 'center', marginBottom: 12
                }}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={{ color: subtext, fontSize: 10, letterSpacing: 1.5, marginBottom: 4, fontWeight: '700' }}>
                  {item.label}
                </Text>
                <Text style={{ color: text, fontSize: 22, fontWeight: '800', marginBottom: 2 }}>
                  {item.value}
                </Text>
                <Text style={{ color: subtext, fontSize: 11, marginBottom: 10 }}>{item.sub}</Text>
                <View style={{ height: 4, backgroundColor: isDark ? '#1E2A3A' : '#E8ECF4', borderRadius: 2 }}>
                  <View style={{ height: 4, width: `${item.pct}%`, backgroundColor: item.color, borderRadius: 2 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Streaks */}
          {streaks && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/progress');
              }}
              style={{
                backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16,
                borderWidth: 1, borderColor: border,
                shadowColor: '#000', shadowOpacity: isDark ? 0.2 : 0.05, shadowRadius: 8, elevation: 2
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="flame" size={16} color="#FFB300" style={{ marginRight: 6 }} />
                <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, fontWeight: '700' }}>CURRENT STREAKS</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {[
                  { label: 'Water', value: streaks.hydration, icon: 'water', color: '#00D4AA' },
                  { label: 'Sleep', value: streaks.sleep, icon: 'moon', color: '#6C63FF' },
                  { label: 'Habits', value: streaks.habits, icon: 'flash', color: '#FFB300' },
                  { label: 'Meals', value: streaks.nutrition, icon: 'restaurant', color: '#00C853' },
                ].map((s) => (
                  <View key={s.label} style={{ alignItems: 'center' }}>
                    <View style={{
                      width: 48, height: 48, borderRadius: 16,
                      backgroundColor: `${s.color}15`,
                      justifyContent: 'center', alignItems: 'center', marginBottom: 8
                    }}>
                      <Ionicons name={s.icon} size={22} color={s.color} />
                    </View>
                    <AnimatedNumber
                      value={s.value}
                      duration={1000}
                      style={{ color: s.color, fontSize: 22, fontWeight: '800' }}
                    />
                    <Text style={{ color: subtext, fontSize: 10, marginTop: 2, fontWeight: '600' }}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          )}

          {/* Aurora CTA */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/companion');
            }}
          >
            <LinearGradient
              colors={isDark ? ['#1a1535', '#141927'] : ['#F0EEFF', '#FFFFFF']}
              style={{
                borderRadius: 20, padding: 20,
                borderWidth: 1.5, borderColor: '#6C63FF40'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 52, height: 52, borderRadius: 26,
                  backgroundColor: '#6C63FF',
                  justifyContent: 'center', alignItems: 'center', marginRight: 16,
                  shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6
                }}>
                  <Ionicons name="sparkles" size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: text, fontWeight: '800', fontSize: 16 }}>Talk to Aurora</Text>
                  <Text style={{ color: subtext, fontSize: 13, marginTop: 2 }}>
                    Your AI health companion
                  </Text>
                </View>
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: '#6C63FF20',
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Ionicons name="arrow-forward" size={18} color="#6C63FF" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}