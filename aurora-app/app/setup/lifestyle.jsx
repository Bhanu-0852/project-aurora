import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../services/auth.service';

export default function LifestyleSetup() {
  const [wakeTime, setWakeTime] = useState('6:00 AM');
  const [bedTime, setBedTime] = useState('10:00 PM');
  const [activityLevel, setActivityLevel] = useState('');

  const wakeTimes = ['5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM'];
  const bedTimes = ['9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM'];
  const activityLevels = [
    { key: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: '🪑' },
    { key: 'light', label: 'Light', desc: '1-3 days/week', icon: '🚶' },
    { key: 'moderate', label: 'Moderate', desc: '3-5 days/week', icon: '🏃' },
    { key: 'active', label: 'Very Active', desc: '6-7 days/week', icon: '💪' },
  ];

  const handleNext = async () => {
    if (!activityLevel) {
      Alert.alert('Select Activity', 'Please select your activity level');
      return;
    }
    try {
      await updateProfile({ wakeTime, bedTime, activityLevel });
    } catch (e) {}
    router.replace('/setup/goals');
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#141927']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }}>
        <View style={{ marginTop: 60, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {[1,2,3,4].map((s) => (
              <View key={s} style={{
                flex: 1, height: 4, borderRadius: 2, marginRight: s < 4 ? 4 : 0,
                backgroundColor: s <= 3 ? '#6C63FF' : '#1E2A3A'
              }} />
            ))}
          </View>
          <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>STEP 3 OF 4</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>Your Lifestyle</Text>
          <Text style={{ color: '#8B9CB6', fontSize: 15, marginTop: 8 }}>Tell us about your daily routine</Text>
        </View>

        <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 12, letterSpacing: 2 }}>WAKE UP TIME</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {wakeTimes.map((t) => (
            <TouchableOpacity key={t} onPress={() => setWakeTime(t)} style={{
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, marginRight: 8,
              backgroundColor: wakeTime === t ? '#6C63FF' : '#1E2A3A',
              borderWidth: 1, borderColor: wakeTime === t ? '#6C63FF' : '#1E2A3A'
            }}>
              <Text style={{ color: wakeTime === t ? '#FFFFFF' : '#8B9CB6', fontWeight: '600' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 12, letterSpacing: 2 }}>BED TIME</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {bedTimes.map((t) => (
            <TouchableOpacity key={t} onPress={() => setBedTime(t)} style={{
              paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, marginRight: 8,
              backgroundColor: bedTime === t ? '#6C63FF' : '#1E2A3A',
              borderWidth: 1, borderColor: bedTime === t ? '#6C63FF' : '#1E2A3A'
            }}>
              <Text style={{ color: bedTime === t ? '#FFFFFF' : '#8B9CB6', fontWeight: '600' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 12, letterSpacing: 2 }}>ACTIVITY LEVEL</Text>
        {activityLevels.map((level) => (
          <TouchableOpacity key={level.key} onPress={() => setActivityLevel(level.key)} style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: activityLevel === level.key ? '#1E2A3A' : '#141927',
            borderRadius: 14, padding: 16, marginBottom: 10,
            borderWidth: 1.5, borderColor: activityLevel === level.key ? '#6C63FF' : '#1E2A3A'
          }}>
            <Text style={{ fontSize: 28, marginRight: 14 }}>{level.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>{level.label}</Text>
              <Text style={{ color: '#8B9CB6', fontSize: 13, marginTop: 2 }}>{level.desc}</Text>
            </View>
            <View style={{
              width: 22, height: 22, borderRadius: 11, borderWidth: 2,
              borderColor: activityLevel === level.key ? '#6C63FF' : '#3D4F6B',
              backgroundColor: activityLevel === level.key ? '#6C63FF' : 'transparent',
              justifyContent: 'center', alignItems: 'center'
            }}>
              {activityLevel === level.key && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleNext} style={{
          backgroundColor: '#6C63FF', borderRadius: 16, padding: 18,
          alignItems: 'center', marginTop: 20,
          shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}