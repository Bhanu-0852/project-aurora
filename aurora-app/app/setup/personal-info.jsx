import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../services/auth.service';

export default function PersonalInfo() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const genders = [
    { key: 'Male', icon: '👨' },
    { key: 'Female', icon: '👩' },
    { key: 'Other', icon: '🧑' }
  ];

  const handleNext = async () => {
    if (!name || !age || !gender) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }
    try {
      await updateProfile({ name, age: Number(age), gender });
    } catch (e) {}
    router.replace('/setup/body-info');
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#141927']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }}>
        <View style={{ marginTop: 60, marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {[1,2,3,4].map((s) => (
              <View key={s} style={{
                flex: 1, height: 4, borderRadius: 2, marginRight: s < 4 ? 4 : 0,
                backgroundColor: s === 1 ? '#6C63FF' : '#1E2A3A'
              }} />
            ))}
          </View>
          <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>STEP 1 OF 4</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>Personal Info</Text>
          <Text style={{ color: '#8B9CB6', fontSize: 15, marginTop: 8 }}>Let Aurora know who you are</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>YOUR NAME</Text>
          <TextInput
            value={name} onChangeText={setName}
            placeholder="Bhanu Prakash"
            placeholderTextColor="#3D4F6B"
            style={{ backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16, color: '#FFFFFF', fontSize: 16 }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>AGE</Text>
          <TextInput
            value={age} onChangeText={setAge}
            placeholder="22" placeholderTextColor="#3D4F6B" keyboardType="numeric"
            style={{ backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16, color: '#FFFFFF', fontSize: 16 }}
          />
        </View>

        <View style={{ marginBottom: 40 }}>
          <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 12, letterSpacing: 2 }}>GENDER</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {genders.map((g) => (
              <TouchableOpacity key={g.key} onPress={() => setGender(g.key)} style={{
                flex: 1, padding: 16, borderRadius: 16, alignItems: 'center',
                backgroundColor: gender === g.key ? '#6C63FF' : '#1E2A3A',
                borderWidth: 1.5,
                borderColor: gender === g.key ? '#6C63FF' : '#1E2A3A'
              }}>
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{g.icon}</Text>
                <Text style={{ color: gender === g.key ? '#FFFFFF' : '#8B9CB6', fontWeight: '600', fontSize: 13 }}>
                  {g.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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