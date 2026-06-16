import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: '✦',
    title: 'Meet Aurora',
    subtitle: 'Your personal AI health companion that truly understands you.',
    color: '#6C63FF',
    bg: ['#0A0F1E', '#141927'],
  },
  {
    icon: '💧',
    title: 'Track Everything',
    subtitle: 'Hydration, sleep, habits, and nutrition — all in one beautiful place.',
    color: '#00D4AA',
    bg: ['#0A1A1A', '#0D2020'],
  },
  {
    icon: '🧠',
    title: 'AI Insights',
    subtitle: 'Receive personalized daily insights powered by artificial intelligence.',
    color: '#8B85FF',
    bg: ['#0D0A1E', '#141927'],
  },
  {
    icon: '🔥',
    title: 'Build Streaks',
    subtitle: 'Build healthier habits through consistency and meaningful streaks.',
    color: '#FFB300',
    bg: ['#1A1000', '#1A1400'],
  },
  {
    icon: '🌟',
    title: 'Know Yourself',
    subtitle: 'Learn more about your health and yourself every single day.',
    color: '#00D4AA',
    bg: ['#0A0F1E', '#141927'],
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      router.replace('/auth/signup');
    }
  };

  return (
    <LinearGradient colors={slide.bg} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Skip */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20, paddingTop: 50 }}>
          {current < slides.length - 1 && (
            <TouchableOpacity onPress={() => router.replace('/auth/signup')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20
              }}>
              <Text style={{ color: '#8B9CB6', fontSize: 14 }}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <View style={{
            width: 140, height: 140, borderRadius: 70,
            backgroundColor: `${slide.color}15`,
            justifyContent: 'center', alignItems: 'center',
            marginBottom: 48,
            borderWidth: 1, borderColor: `${slide.color}30`,
            shadowColor: slide.color,
            shadowOpacity: 0.3, shadowRadius: 30, elevation: 10
          }}>
            <Text style={{ fontSize: 64 }}>{slide.icon}</Text>
          </View>

          <Text style={{
            color: '#FFFFFF', fontSize: 32, fontWeight: '800',
            textAlign: 'center', marginBottom: 16, letterSpacing: 0.5
          }}>
            {slide.title}
          </Text>

          <Text style={{
            color: '#8B9CB6', fontSize: 16, textAlign: 'center',
            lineHeight: 26, paddingHorizontal: 8
          }}>
            {slide.subtitle}
          </Text>
        </View>

        {/* Bottom */}
        <View style={{ padding: 32, paddingBottom: 48 }}>
          {/* Dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
            {slides.map((s, i) => (
              <View key={i} style={{
                width: i === current ? 32 : 8, height: 8,
                borderRadius: 4, marginHorizontal: 4,
                backgroundColor: i === current ? slide.color : '#1E2A3A'
              }} />
            ))}
          </View>

          <TouchableOpacity onPress={next} style={{
            backgroundColor: slide.color, borderRadius: 18,
            padding: 18, alignItems: 'center',
            shadowColor: slide.color, shadowOpacity: 0.5,
            shadowRadius: 20, elevation: 10
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 }}>
              {current === slides.length - 1 ? 'Get Started ✦' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}