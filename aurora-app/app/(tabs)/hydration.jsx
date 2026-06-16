import { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, Alert, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getToday, logWater, getHistory } from '../../services/hydration.service';
import { useTheme } from '../../hooks/useTheme';
import AnimatedNumber from '../../components/common/AnimatedNumber';

const quickAmounts = [
  { amount: 150, label: 'Sip', icon: 'cafe' },
  { amount: 250, label: 'Glass', icon: 'beer' },
  { amount: 350, label: 'Mug', icon: 'flask' },
  { amount: 500, label: 'Bottle', icon: 'water' },
];

export default function Hydration() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const [hydration, setHydration] = useState(null);
  const [history, setHistory] = useState([]);
  const [custom, setCustom] = useState('');
  const [celebrating, setCelebrating] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadData = async () => {
    try {
      const [h, hist] = await Promise.all([getToday(), getHistory()]);
      setHydration(h.data);
      setHistory(hist.data);
      const pct = Math.min(h.data.total / h.data.goal, 1);
      Animated.timing(fillAnim, { toValue: pct, duration: 1200, useNativeDriver: false }).start();
    } catch (err) {
      console.log('Hydration error:', err.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLog = async (amount) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.02, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    try {
      const res = await logWater(amount);
      setHydration(res.data);
      const pct = Math.min(res.data.total / res.data.goal, 1);
      Animated.timing(fillAnim, { toValue: pct, duration: 800, useNativeDriver: false }).start();

      // Celebrate if goal reached
      if (res.data.total >= res.data.goal && !celebrating) {
        setCelebrating(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Animated.sequence([
          Animated.timing(celebrateAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.delay(2000),
          Animated.timing(celebrateAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setCelebrating(false));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to log water');
    }
  };

  const handleCustom = () => {
    const amount = Number(custom);
    if (!amount || amount <= 0 || amount > 2000) {
      Alert.alert('Invalid', 'Enter a valid amount between 1-2000ml');
      return;
    }
    handleLog(amount);
    setCustom('');
  };

  const pct = hydration ? Math.min((hydration.total / hydration.goal) * 100, 100) : 0;
  const bottleHeight = 220;
  const fillColor = pct >= 100 ? '#00D4AA' : pct >= 60 ? '#00B8A0' : pct >= 30 ? '#6C63FF' : '#8B85FF';

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, bottleHeight]
  });

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Ionicons name="water" size={26} color="#00D4AA" style={{ marginRight: 10 }} />
          <Text style={{ color: text, fontSize: 28, fontWeight: '800' }}>Hydration</Text>
        </View>
        <Text style={{ color: subtext, fontSize: 14, marginBottom: 28 }}>
          {pct >= 100 ? '🎉 Daily goal achieved! Amazing!' : `${Math.round((hydration?.goal || 2500) - (hydration?.total || 0))}ml left to reach your goal`}
        </Text>

        {/* Celebration Banner */}
        <Animated.View style={{
          opacity: celebrateAnim,
          transform: [{ scale: celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          marginBottom: celebrating ? 16 : 0,
          overflow: 'hidden',
          height: celebrating ? undefined : 0
        }}>
          <LinearGradient colors={['#00D4AA', '#00B8A0']} style={{ borderRadius: 16, padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>🎉 Goal Achieved!</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>
              Incredible! You've hit your daily water goal!
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Bottle + Stats */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          {/* Bottle cap */}
          <View style={{
            width: 40, height: 18, borderRadius: 8,
            backgroundColor: fillColor, marginBottom: 3, opacity: 0.7
          }} />

          {/* Animated bottle */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={{
              width: 110, height: bottleHeight, borderRadius: 28,
              backgroundColor: isDark ? '#1E2A3A' : '#E8F4FF',
              overflow: 'hidden', borderWidth: 2.5, borderColor: fillColor,
              position: 'relative'
            }}>
              <Animated.View style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: fillHeight, backgroundColor: fillColor,
                opacity: 0.9, borderBottomLeftRadius: 25, borderBottomRightRadius: 25
              }} />
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>
                  {Math.round(pct)}%
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 }}>
                  {hydration?.total || 0}ml
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats below bottle */}
          <View style={{ flexDirection: 'row', gap: 24, marginTop: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <AnimatedNumber
                value={hydration?.total || 0}
                style={{ color: fillColor, fontSize: 28, fontWeight: '800' }}
                suffix="ml"
              />
              <Text style={{ color: subtext, fontSize: 11, marginTop: 2 }}>consumed</Text>
            </View>
            <View style={{ width: 1, backgroundColor: border }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: text, fontSize: 28, fontWeight: '800' }}>
                {hydration?.goal || 2500}ml
              </Text>
              <Text style={{ color: subtext, fontSize: 11, marginTop: 2 }}>daily goal</Text>
            </View>
          </View>
        </View>

        {/* Quick Add */}
        <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>
          QUICK ADD
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {quickAmounts.map((q) => (
            <TouchableOpacity
              key={q.amount}
              onPress={() => handleLog(q.amount)}
              style={{
                flex: 1, backgroundColor: card, borderRadius: 16, padding: 14,
                alignItems: 'center', borderWidth: 1, borderColor: border
              }}
            >
              <Ionicons name={q.icon} size={22} color="#00D4AA" style={{ marginBottom: 6 }} />
              <Text style={{ color: text, fontSize: 13, fontWeight: '700' }}>{q.amount}ml</Text>
              <Text style={{ color: subtext, fontSize: 10, marginTop: 2 }}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Entry */}
        <View style={{
          backgroundColor: card, borderRadius: 16, padding: 16, marginBottom: 24,
          flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: border
        }}>
          <Ionicons name="add-circle-outline" size={22} color={subtext} style={{ marginTop: 2 }} />
          <TextInput
            value={custom} onChangeText={setCustom}
            placeholder="Custom amount (ml)"
            placeholderTextColor={subtext} keyboardType="numeric"
            style={{ flex: 1, color: text, fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={handleCustom}
            style={{
              backgroundColor: '#00D4AA', borderRadius: 12,
              paddingHorizontal: 20, justifyContent: 'center',
              shadowColor: '#00D4AA', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        {history.length > 0 && (
          <>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>
              LAST 7 DAYS
            </Text>
            {history.map((day, i) => {
              const dayPct = Math.min((day.total / day.goal) * 100, 100);
              const goalMet = day.total >= day.goal;
              return (
                <View key={i} style={{
                  backgroundColor: card, borderRadius: 14, padding: 14,
                  flexDirection: 'row', alignItems: 'center',
                  marginBottom: 8, borderWidth: 1,
                  borderColor: goalMet ? '#00D4AA30' : border
                }}>
                  <View style={{
                    width: 36, height: 36, borderRadius: 12,
                    backgroundColor: goalMet ? '#00D4AA15' : isDark ? '#1E2A3A' : '#F0F4FF',
                    justifyContent: 'center', alignItems: 'center', marginRight: 12
                  }}>
                    <Ionicons name={goalMet ? 'checkmark-circle' : 'water-outline'} size={18} color={goalMet ? '#00D4AA' : subtext} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: text, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <View style={{ height: 4, backgroundColor: isDark ? '#1E2A3A' : '#E2E8F4', borderRadius: 2 }}>
                      <View style={{
                        height: 4, width: `${dayPct}%`,
                        backgroundColor: goalMet ? '#00D4AA' : '#6C63FF', borderRadius: 2
                      }} />
                    </View>
                  </View>
                  <Text style={{
                    color: goalMet ? '#00D4AA' : text, fontWeight: '700',
                    marginLeft: 12, fontSize: 13
                  }}>
                    {day.total}ml
                  </Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}