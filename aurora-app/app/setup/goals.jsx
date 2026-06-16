import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../services/auth.service';

const goals = [
  { key: 'hydration', label: 'Improve Hydration', icon: '💧', color: '#00D4AA' },
  { key: 'sleep', label: 'Sleep Better', icon: '😴', color: '#6C63FF' },
  { key: 'habits', label: 'Build Habits', icon: '⚡', color: '#FFB300' },
  { key: 'nutrition', label: 'Eat Healthier', icon: '🥗', color: '#00C853' },
  { key: 'energy', label: 'More Energy', icon: '🔋', color: '#FF6B35' },
  { key: 'consistency', label: 'Stay Consistent', icon: '🎯', color: '#8B85FF' },
];

export default function GoalsSetup() {
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(g => g !== key) : [...prev, key]
    );
  };

  const handleNext = async () => {
    if (selected.length === 0) {
      Alert.alert('Select Goals', 'Please select at least one goal');
      return;
    }
    try {
      await updateProfile({ goals: selected });
    } catch (e) {}
    router.replace('/setup/notifications');
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
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>Your Goals</Text>
          <Text style={{ color: '#8B9CB6', fontSize: 15, marginTop: 8 }}>
            What would you like to improve? (Select all that apply)
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {goals.map((goal) => {
            const isSelected = selected.includes(goal.key);
            return (
              <TouchableOpacity key={goal.key} onPress={() => toggle(goal.key)} style={{
                width: '47%', padding: 20, borderRadius: 18, alignItems: 'center',
                backgroundColor: isSelected ? `${goal.color}15` : '#141927',
                borderWidth: 1.5,
                borderColor: isSelected ? goal.color : '#1E2A3A'
              }}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>{goal.icon}</Text>
                <Text style={{
                  color: isSelected ? '#FFFFFF' : '#8B9CB6',
                  fontSize: 13, textAlign: 'center', fontWeight: '700'
                }}>
                  {goal.label}
                </Text>
                {isSelected && (
                  <View style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: goal.color,
                    justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ color: '#8B9CB6', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
          {selected.length} goal{selected.length !== 1 ? 's' : ''} selected
        </Text>

        <TouchableOpacity onPress={handleNext} style={{
          backgroundColor: '#6C63FF', borderRadius: 16, padding: 18, alignItems: 'center',
          shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}