import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuroraOrb({ isListening = false, isSpeaking = false, isThinking = false }) {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.5)).current;

  const active = isListening || isSpeaking;
  const orbColor = isListening ? '#FF5252' : isSpeaking ? '#00D4AA' : isThinking ? '#FFB300' : '#6C63FF';
  const iconName = isListening ? 'mic' : isSpeaking ? 'volume-high' : isThinking ? 'ellipsis-horizontal' : 'sparkles';

  useEffect(() => {
    const duration = active ? 600 : 2000;
    const loops = [
      Animated.loop(Animated.sequence([
        Animated.timing(pulse1, { toValue: active ? 1.3 : 1.05, duration, useNativeDriver: true }),
        Animated.timing(pulse1, { toValue: 1, duration, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(pulse2, { toValue: active ? 1.5 : 1.08, duration: duration * 1.3, useNativeDriver: true }),
        Animated.timing(pulse2, { toValue: 1, duration: duration * 1.3, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
      ])),
    ];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [isListening, isSpeaking, isThinking]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 160, height: 160 }}>
      <Animated.View style={{
        position: 'absolute', width: 160, height: 160, borderRadius: 80,
        backgroundColor: `${orbColor}10`, transform: [{ scale: pulse2 }], opacity: glow
      }} />
      <Animated.View style={{
        position: 'absolute', width: 120, height: 120, borderRadius: 60,
        backgroundColor: `${orbColor}20`, transform: [{ scale: pulse1 }]
      }} />
      <View style={{
        width: 80, height: 80, borderRadius: 40, backgroundColor: orbColor,
        justifyContent: 'center', alignItems: 'center',
        shadowColor: orbColor, shadowOpacity: 0.8, shadowRadius: 20, elevation: 12
      }}>
        <Ionicons name={iconName} size={32} color="#FFFFFF" />
      </View>
    </View>
  );
}