import { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../services/auth.service';

export default function NotificationsSetup() {
  const [notifications, setNotifications] = useState({
    hydration: true, sleep: true, habits: true, insights: true,
  });

  const items = [
    { key: 'hydration', label: 'Hydration Reminders', desc: 'Stay on track with water intake', icon: '💧' },
    { key: 'sleep', label: 'Sleep Reminders', desc: 'Wind down at the right time', icon: '😴' },
    { key: 'habits', label: 'Habit Reminders', desc: 'Never miss your daily habits', icon: '⚡' },
    { key: 'insights', label: 'Daily Insights', desc: 'Get your AI-powered insight', icon: '🧠' },
  ];

  const handleFinish = async () => {
    try {
      await updateProfile({ notifications });
    } catch (e) {}
    router.replace('/(tabs)/home');
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#141927']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }}>
        <View style={{ marginTop: 60, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {[1,2,3,4].map((s) => (
              <View key={s} style={{
                flex: 1, height: 4, borderRadius: 2, marginRight: s < 4 ? 4 : 0,
                backgroundColor: '#6C63FF'
              }} />
            ))}
          </View>
          <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>STEP 4 OF 4</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>Stay Reminded</Text>
          <Text style={{ color: '#8B9CB6', fontSize: 15, marginTop: 8 }}>
            Choose what Aurora should remind you about
          </Text>
        </View>

        {items.map((item) => (
          <View key={item.key} style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#1E2A3A', borderRadius: 16, padding: 20, marginBottom: 12,
            borderWidth: 1,
            borderColor: notifications[item.key] ? '#6C63FF40' : '#1E2A3A'
          }}>
            <View style={{
              width: 48, height: 48, borderRadius: 24,
              backgroundColor: notifications[item.key] ? '#6C63FF20' : '#141927',
              justifyContent: 'center', alignItems: 'center', marginRight: 14
            }}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>{item.label}</Text>
              <Text style={{ color: '#8B9CB6', fontSize: 13, marginTop: 2 }}>{item.desc}</Text>
            </View>
            <Switch
              value={notifications[item.key]}
              onValueChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              trackColor={{ false: '#3D4F6B', true: '#6C63FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}

        <TouchableOpacity onPress={handleFinish} style={{
          backgroundColor: '#6C63FF', borderRadius: 16, padding: 18,
          alignItems: 'center', marginTop: 32,
          shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>
            Start My Journey ✦
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}