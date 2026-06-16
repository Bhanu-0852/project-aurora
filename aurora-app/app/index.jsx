import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import useAppStore from '../store/useStore';
import { getMe } from '../services/auth.service';

export default function SplashScreen() {
  const { setToken, setUser } = useAppStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    checkAuth();
  }, [ready]);

  const checkAuth = async () => {
    await new Promise(r => setTimeout(r, 2200));
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setToken(token);
        try {
          const res = await getMe();
          setUser(res.data);
          router.replace('/(tabs)/home');
        } catch {
          await AsyncStorage.removeItem('token');
          router.replace('/onboarding');
        }
      } else {
        router.replace('/onboarding');
      }
    } catch {
      router.replace('/onboarding');
    }
  };

  return (
    <LinearGradient
      colors={['#0A0F1E', '#141927', '#1A2235']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ alignItems: 'center' }}>
        <View style={{
          width: 120, height: 120, borderRadius: 60,
          backgroundColor: 'rgba(108,99,255,0.15)',
          justifyContent: 'center', alignItems: 'center', marginBottom: 8,
        }}>
          <View style={{
            width: 90, height: 90, borderRadius: 45, backgroundColor: '#6C63FF',
            justifyContent: 'center', alignItems: 'center',
            shadowColor: '#6C63FF', shadowOpacity: 1, shadowRadius: 40, elevation: 20
          }}>
            <Text style={{ fontSize: 42 }}>✦</Text>
          </View>
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '800', letterSpacing: 6, marginTop: 20 }}>
          AURORA
        </Text>
        <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 4, marginTop: 6, fontWeight: '600' }}>
          HEALTH COMPANION
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 60, alignItems: 'center' }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#6C63FF', opacity: 0.6 }} />
        <Text style={{ color: '#8B9CB6', fontSize: 13, marginTop: 16, letterSpacing: 1 }}>
          Understand yourself better every day.
        </Text>
      </View>
    </LinearGradient>
  );
}