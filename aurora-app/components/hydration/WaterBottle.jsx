import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function WaterBottle({ current = 0, goal = 2500 }) {
  const { isDark } = useTheme();
  const fillAnim = useRef(new Animated.Value(0)).current;
  const pct = Math.min((current / goal) * 100, 100);
  const bottleHeight = 220;
  const fillColor = pct >= 100 ? '#00D4AA' : pct >= 60 ? '#00B8A0' : pct >= 30 ? '#6C63FF' : '#8B85FF';

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: pct / 100, duration: 1000, useNativeDriver: false
    }).start();
  }, [current]);

  const fillHeight = fillAnim.interpolate({ inputRange: [0, 1], outputRange: [0, bottleHeight] });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 32, height: 16, backgroundColor: fillColor, borderRadius: 6, marginBottom: 2, opacity: 0.6 }} />
      <View style={{
        width: 100, height: bottleHeight, borderRadius: 24, overflow: 'hidden',
        backgroundColor: isDark ? '#1E2A3A' : '#E8F4FF',
        borderWidth: 2, borderColor: fillColor, position: 'relative'
      }}>
        <Animated.View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: fillHeight, backgroundColor: fillColor, opacity: 0.9
        }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800' }}>{Math.round(pct)}%</Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{current}ml</Text>
        </View>
      </View>
      <Text style={{ color: fillColor, fontSize: 13, fontWeight: '700', marginTop: 12 }}>
        {pct >= 100 ? '🎉 Goal Achieved!' : `${Math.round(goal - current)}ml remaining`}
      </Text>
    </View>
  );
}