import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../services/auth.service';

export default function BodyInfo() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('metric');

  const bmi = height && weight
    ? (Number(weight) / ((Number(height) / 100) ** 2)).toFixed(1)
    : null;

  const getBMICategory = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: '#FFB300' };
    if (b < 25) return { label: 'Normal ✅', color: '#00D4AA' };
    if (b < 30) return { label: 'Overweight', color: '#FF8C00' };
    return { label: 'Obese', color: '#FF5252' };
  };

  const handleNext = async () => {
    if (!height || !weight) {
      Alert.alert('Missing Info', 'Please enter height and weight');
      return;
    }
    try {
      await updateProfile({ height: Number(height), weight: Number(weight) });
    } catch (e) {}
    router.replace('/setup/lifestyle');
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#141927']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }}>
        <View style={{ marginTop: 60, marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {[1,2,3,4].map((s) => (
              <View key={s} style={{
                flex: 1, height: 4, borderRadius: 2, marginRight: s < 4 ? 4 : 0,
                backgroundColor: s <= 2 ? '#6C63FF' : '#1E2A3A'
              }} />
            ))}
          </View>
          <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>STEP 2 OF 4</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>Body Metrics</Text>
          <Text style={{ color: '#8B9CB6', fontSize: 15, marginTop: 8 }}>
            Helps personalize your hydration and health goals
          </Text>
        </View>

        {/* Unit Toggle */}
        <View style={{
          flexDirection: 'row', backgroundColor: '#1E2A3A',
          borderRadius: 14, padding: 4, marginBottom: 28
        }}>
          {[
            { key: 'metric', label: 'Metric (cm/kg)' },
            { key: 'imperial', label: 'Imperial (ft/lbs)' }
          ].map((u) => (
            <TouchableOpacity key={u.key} onPress={() => setUnit(u.key)} style={{
              flex: 1, padding: 12, borderRadius: 12, alignItems: 'center',
              backgroundColor: unit === u.key ? '#6C63FF' : 'transparent'
            }}>
              <Text style={{ color: unit === u.key ? '#FFFFFF' : '#8B9CB6', fontWeight: '600', fontSize: 13 }}>
                {u.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[
            { label: `HEIGHT (${unit === 'metric' ? 'cm' : 'ft'})`, value: height, setter: setHeight, placeholder: unit === 'metric' ? '175' : '5.9' },
            { label: `WEIGHT (${unit === 'metric' ? 'kg' : 'lbs'})`, value: weight, setter: setWeight, placeholder: unit === 'metric' ? '70' : '154' },
          ].map((field) => (
            <View key={field.label} style={{ flex: 1 }}>
              <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>{field.label}</Text>
              <TextInput
                value={field.value} onChangeText={field.setter}
                placeholder={field.placeholder} placeholderTextColor="#3D4F6B" keyboardType="numeric"
                style={{ backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16, color: '#FFFFFF', fontSize: 16 }}
              />
            </View>
          ))}
        </View>

        {bmi && (() => {
          const cat = getBMICategory(parseFloat(bmi));
          return (
            <View style={{
              backgroundColor: '#1E2A3A', borderRadius: 16, padding: 20,
              marginBottom: 28, alignItems: 'center',
              borderWidth: 1, borderColor: `${cat.color}40`
            }}>
              <Text style={{ color: '#8B9CB6', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>YOUR BMI</Text>
              <Text style={{ color: cat.color, fontSize: 40, fontWeight: '800' }}>{bmi}</Text>
              <Text style={{ color: cat.color, fontSize: 14, fontWeight: '600', marginTop: 4 }}>{cat.label}</Text>
            </View>
          );
        })()}

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