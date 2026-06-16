import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Switch, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import useAppStore from '../../store/useStore';
import { useTheme } from '../../hooks/useTheme';
import { updateNotifications, getMe } from '../../services/auth.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Profile() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const { user, logout, theme, setTheme, setUser } = useAppStore();
  const [notifications, setNotifications] = useState({
    hydration: true, sleep: true, habits: true, insights: true
  });

  useEffect(() => {
    refreshUser();
    loadNotifications();
    loadTheme();
    requestNotificationPermissions();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch (e) {}
  };

  const requestNotificationPermissions = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {}
  };

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) setNotifications(JSON.parse(saved));
    } catch (e) {}
  };

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved) setTheme(saved);
    } catch (e) {}
  };

  const scheduleNotifications = async (notifs) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (notifs.hydration) {
        await Notifications.scheduleNotificationAsync({
          content: { title: '💧 Hydration Reminder', body: 'Time to drink some water!', sound: 'default' },
          trigger: { hour: 10, minute: 0, repeats: true },
        });
        await Notifications.scheduleNotificationAsync({
          content: { title: '💧 Hydration Reminder', body: 'Stay hydrated! Drink water now.', sound: 'default' },
          trigger: { hour: 14, minute: 0, repeats: true },
        });
        await Notifications.scheduleNotificationAsync({
          content: { title: '💧 Hydration Reminder', body: 'Evening water check — how much have you had?', sound: 'default' },
          trigger: { hour: 18, minute: 0, repeats: true },
        });
      }

      if (notifs.sleep) {
        await Notifications.scheduleNotificationAsync({
          content: { title: '😴 Sleep Reminder', body: 'Time to wind down for bed. Good night!', sound: 'default' },
          trigger: { hour: 22, minute: 0, repeats: true },
        });
      }

      if (notifs.habits) {
        await Notifications.scheduleNotificationAsync({
          content: { title: '⚡ Habit Check', body: 'Have you completed your habits today?', sound: 'default' },
          trigger: { hour: 8, minute: 0, repeats: true },
        });
        await Notifications.scheduleNotificationAsync({
          content: { title: '⚡ Evening Habit Reminder', body: "Don't forget your evening habits!", sound: 'default' },
          trigger: { hour: 19, minute: 0, repeats: true },
        });
      }

      if (notifs.insights) {
        await Notifications.scheduleNotificationAsync({
          content: { title: '✦ Aurora Daily Insight', body: 'Your daily health insight is ready. Open Aurora!', sound: 'default' },
          trigger: { hour: 9, minute: 0, repeats: true },
        });
      }
    } catch (e) {
      console.log('Notification scheduling error:', e);
    }
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await Notifications.cancelAllScheduledNotificationsAsync();
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('notifications');
          await AsyncStorage.removeItem('theme');
          logout();
          router.replace('/auth/login');
        }
      }
    ]);
  };

  const handleThemeChange = async (newTheme) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const handleNotifToggle = async (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    try { await updateNotifications(updated); } catch (e) {}
    await scheduleNotifications(updated);
  };

  const themeOptions = [
    { key: 'light', label: 'Light', icon: 'sunny' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
    { key: 'system', label: 'System', icon: 'phone-portrait' },
  ];

  const notifItems = [
    { key: 'hydration', label: 'Hydration Reminders', desc: 'Reminders at 10am, 2pm, 6pm', icon: 'water', color: '#00D4AA' },
    { key: 'sleep', label: 'Sleep Reminders', desc: 'Wind down reminder at 10pm', icon: 'moon', color: '#6C63FF' },
    { key: 'habits', label: 'Habit Reminders', desc: 'Check-ins at 8am & 7pm', icon: 'flash', color: '#FFB300' },
    { key: 'insights', label: 'Daily Insights', desc: 'AI health tips at 9am', icon: 'sparkles', color: '#8B85FF' },
  ];

  const settingsItems = [
    { icon: 'person', label: 'Personal Info', desc: 'Name, age, gender', route: '/setup/personal-info', color: '#6C63FF' },
    { icon: 'barbell', label: 'Body Metrics', desc: 'Height, weight, BMI', route: '/setup/body-info', color: '#00D4AA' },
    { icon: 'time', label: 'Lifestyle', desc: 'Wake/bed time, activity', route: '/setup/lifestyle', color: '#FFB300' },
    { icon: 'flag', label: 'Health Goals', desc: 'Update your goals', route: '/setup/goals', color: '#FF6B35' },
  ];

  const bmi = user?.height && user?.weight
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={isDark ? ['#0E1422', '#141927'] : ['#F0EEFF', '#F5F7FF']}
          style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <Text style={{ color: text, fontSize: 28, fontWeight: '800', marginBottom: 20 }}>Profile</Text>

          {/* User Card */}
          <LinearGradient
            colors={['#6C63FF', '#8B85FF']}
            style={{ borderRadius: 24, padding: 22 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 68, height: 68, borderRadius: 34,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center', alignItems: 'center', marginRight: 16,
                borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)'
              }}>
                <Ionicons name="person" size={34} color="rgba(255,255,255,0.9)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>
                  {user?.name || 'User'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 }}>
                  {user?.email || ''}
                </Text>
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
                  paddingHorizontal: 10, paddingVertical: 4,
                  alignSelf: 'flex-start', marginTop: 8,
                  flexDirection: 'row', alignItems: 'center', gap: 4
                }}>
                  <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                    Aurora Member
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={{
              flexDirection: 'row', gap: 8,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 14
            }}>
              {[
                { label: 'Height', value: user?.height ? `${user.height}cm` : '--' },
                { label: 'Weight', value: user?.weight ? `${user.weight}kg` : '--' },
                { label: 'BMI', value: bmi || '--' },
                { label: 'Activity', value: user?.activityLevel ? user.activityLevel.slice(0, 3).toUpperCase() : '--' },
              ].map((stat, i, arr) => (
                <View key={stat.label} style={{
                  flex: 1, alignItems: 'center',
                  borderRightWidth: i < arr.length - 1 ? 1 : 0,
                  borderRightColor: 'rgba(255,255,255,0.2)'
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>{stat.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>

          {/* Appearance */}
          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700', marginTop: 4 }}>
            APPEARANCE
          </Text>
          <View style={{
            backgroundColor: card, borderRadius: 20, padding: 16,
            marginBottom: 20, borderWidth: 1, borderColor: border
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <Ionicons name="contrast" size={18} color="#6C63FF" style={{ marginRight: 8 }} />
              <Text style={{ color: text, fontWeight: '700', fontSize: 15 }}>Theme</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {themeOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => handleThemeChange(opt.key)}
                  style={{
                    flex: 1, paddingVertical: 14, paddingHorizontal: 8,
                    borderRadius: 14, alignItems: 'center',
                    backgroundColor: theme === opt.key ? '#6C63FF' : isDark ? '#1E2A3A' : '#F0F4FF',
                    borderWidth: 1.5,
                    borderColor: theme === opt.key ? '#6C63FF' : border,
                    shadowColor: theme === opt.key ? '#6C63FF' : 'transparent',
                    shadowOpacity: 0.3, shadowRadius: 8, elevation: theme === opt.key ? 4 : 0
                  }}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={theme === opt.key ? '#FFFFFF' : subtext}
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={{
                    color: theme === opt.key ? '#FFFFFF' : subtext,
                    fontSize: 11, fontWeight: '700'
                  }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings */}
          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>
            SETTINGS
          </Text>
          <View style={{
            backgroundColor: card, borderRadius: 20,
            marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: border
          }}>
            {settingsItems.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(item.route);
                }}
                style={{
                  flexDirection: 'row', alignItems: 'center', padding: 16,
                  borderBottomWidth: i < settingsItems.length - 1 ? 1 : 0,
                  borderBottomColor: border
                }}
              >
                <View style={{
                  width: 42, height: 42, borderRadius: 14,
                  backgroundColor: `${item.color}15`,
                  justifyContent: 'center', alignItems: 'center', marginRight: 14
                }}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: text, fontWeight: '700', fontSize: 15 }}>{item.label}</Text>
                  <Text style={{ color: subtext, fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={subtext} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications */}
          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>
            NOTIFICATIONS
          </Text>
          <View style={{
            backgroundColor: card, borderRadius: 20,
            marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: border
          }}>
            {notifItems.map((item, i) => (
              <View key={item.key} style={{
                flexDirection: 'row', alignItems: 'center', padding: 16,
                borderBottomWidth: i < notifItems.length - 1 ? 1 : 0,
                borderBottomColor: border
              }}>
                <View style={{
                  width: 42, height: 42, borderRadius: 14,
                  backgroundColor: notifications[item.key] ? `${item.color}15` : isDark ? '#1E2A3A' : '#F0F4FF',
                  justifyContent: 'center', alignItems: 'center', marginRight: 14
                }}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={notifications[item.key] ? item.color : subtext}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: text, fontSize: 15, fontWeight: '600' }}>{item.label}</Text>
                  <Text style={{ color: subtext, fontSize: 11, marginTop: 2 }}>{item.desc}</Text>
                </View>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={() => handleNotifToggle(item.key)}
                  trackColor={{ false: isDark ? '#3D4F6B' : '#D1D9E6', true: '#6C63FF' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>

          {/* App Info */}
          <View style={{
            backgroundColor: card, borderRadius: 20, padding: 20,
            marginBottom: 20, alignItems: 'center',
            borderWidth: 1, borderColor: border
          }}>
            <LinearGradient
              colors={['#6C63FF', '#8B85FF']}
              style={{
                width: 56, height: 56, borderRadius: 28,
                justifyContent: 'center', alignItems: 'center', marginBottom: 12,
                shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6
              }}
            >
              <Ionicons name="sparkles" size={26} color="#FFFFFF" />
            </LinearGradient>
            <Text style={{ color: '#6C63FF', fontSize: 16, fontWeight: '800', letterSpacing: 3 }}>
              AURORA
            </Text>
            <Text style={{ color: subtext, fontSize: 12, marginTop: 4 }}>Version 1.0.0</Text>
            <Text style={{ color: subtext, fontSize: 12, marginTop: 2 }}>
              Your Personal Health Companion
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              gap: 10, backgroundColor: isDark ? '#1E2A3A' : '#FFF0F0',
              borderRadius: 16, padding: 18,
              borderWidth: 1.5, borderColor: '#FF525230'
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF5252" />
            <Text style={{ color: '#FF5252', fontWeight: '800', fontSize: 16 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}