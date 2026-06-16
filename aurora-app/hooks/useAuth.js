import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useStore from '../store/useStore';
import { getMe } from '../services/auth.service';

export const useAuth = () => {
  const { token, setToken, setUser } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        const res = await getMe();
        setUser(res.data);
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding');
      }
    } catch (err) {
      router.replace('/onboarding');
    }
  };

  const saveToken = async (token) => {
    await AsyncStorage.setItem('token', token);
    setToken(token);
  };

  const clearToken = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.replace('/onboarding');
  };

  return { token, saveToken, clearToken };
};