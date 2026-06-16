import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { Animated } from 'react-native';

export default function AnimatedNumber({ value = 0, style, duration = 1000, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef(new Animated.Value(0));

  useEffect(() => {
    animRef.current.setValue(0);
    const listener = animRef.current.addListener(({ value: v }) => {
      setDisplay(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v));
    });
    Animated.timing(animRef.current, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => animRef.current.removeListener(listener);
  }, [value]);

  return (
    <Text style={style}>
      {prefix}{display}{suffix}
    </Text>
  );
}