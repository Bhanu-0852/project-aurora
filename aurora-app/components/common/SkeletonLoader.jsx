import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function SkeletonBox({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  const { isDark } = useTheme();
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    return () => anim.stopAnimation();
  }, []);

  return (
    <Animated.View style={[{
      width, height, borderRadius,
      backgroundColor: isDark ? '#1E2A3A' : '#E2E8F4',
      opacity: anim,
    }, style]} />
  );
}

export function HomeSkeleton() {
  const { card, border } = useTheme();
  return (
    <View style={{ padding: 20, paddingTop: 56 }}>
      <SkeletonBox width={120} height={14} borderRadius={6} style={{ marginBottom: 8 }} />
      <SkeletonBox width={180} height={32} borderRadius={8} style={{ marginBottom: 24 }} />
      <SkeletonBox width="100%" height={120} borderRadius={20} style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <SkeletonBox width="48%" height={100} borderRadius={20} />
        <SkeletonBox width="48%" height={100} borderRadius={20} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <SkeletonBox width="48%" height={100} borderRadius={20} />
        <SkeletonBox width="48%" height={100} borderRadius={20} />
      </View>
      <SkeletonBox width="100%" height={90} borderRadius={20} style={{ marginBottom: 12 }} />
      <SkeletonBox width="100%" height={80} borderRadius={20} />
    </View>
  );
}