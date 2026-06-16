import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { signup } from '../../services/auth.service';
import useAppStore from '../../store/useStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { setToken, setUser } = useAppStore();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields to continue');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await signup({ name, email, password });
      await AsyncStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      router.replace('/setup/personal-info');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0A0F1E', '#141927']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 28, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              width: 60, height: 60, borderRadius: 30,
              backgroundColor: '#6C63FF',
              justifyContent: 'center', alignItems: 'center', marginBottom: 16,
              shadowColor: '#6C63FF', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
            }}>
              <Text style={{ fontSize: 28 }}>✦</Text>
            </View>
            <Text style={{ color: '#6C63FF', fontSize: 12, letterSpacing: 3, marginBottom: 4 }}>
              WELCOME TO
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: 2 }}>
              AURORA
            </Text>
            <Text style={{ color: '#8B9CB6', fontSize: 14, marginTop: 8 }}>
              Create your account to begin
            </Text>
          </View>

          {/* Fields */}
          {[
            { label: 'FULL NAME', value: name, setter: setName, placeholder: 'Bhanu Prakash', secure: false },
            { label: 'EMAIL ADDRESS', value: email, setter: setEmail, placeholder: 'hello@example.com', secure: false },
          ].map((field) => (
            <View key={field.label} style={{ marginBottom: 16 }}>
              <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>
                {field.label}
              </Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                placeholder={field.placeholder}
                placeholderTextColor="#3D4F6B"
                autoCapitalize={field.label === 'FULL NAME' ? 'words' : 'none'}
                keyboardType={field.label === 'EMAIL ADDRESS' ? 'email-address' : 'default'}
                style={{
                  backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16,
                  color: '#FFFFFF', fontSize: 16,
                  borderWidth: 1, borderColor: '#1E2A3A'
                }}
              />
            </View>
          ))}

          {/* Password */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: '#8B9CB6', fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>
              PASSWORD
            </Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                placeholderTextColor="#3D4F6B"
                secureTextEntry={!showPass}
                style={{
                  backgroundColor: '#1E2A3A', borderRadius: 14, padding: 16,
                  color: '#FFFFFF', fontSize: 16,
                  borderWidth: 1, borderColor: '#1E2A3A', paddingRight: 50
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 16, top: 16 }}
              >
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#3D4F6B' : '#6C63FF',
              borderRadius: 16, padding: 18, alignItems: 'center',
              shadowColor: '#6C63FF', shadowOpacity: loading ? 0 : 0.5,
              shadowRadius: 20, elevation: loading ? 0 : 10
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/auth/login')}
            style={{ alignItems: 'center', marginTop: 24 }}
          >
            <Text style={{ color: '#8B9CB6', fontSize: 14 }}>
              Already have an account?{' '}
              <Text style={{ color: '#6C63FF', fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}