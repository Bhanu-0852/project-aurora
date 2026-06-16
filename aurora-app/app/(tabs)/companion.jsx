import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Alert,
  TextInput, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { chat } from '../../services/companion.service';
import useAppStore from '../../store/useStore';
import { useTheme } from '../../hooks/useTheme';

const quickPrompts = [
  "How am I doing today?",
  "I drank 500ml water",
  "I slept 7 hours",
  "Create a meditation habit",
  "Give me health tips",
  "What should I focus on?",
];

export default function Companion() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const { user } = useAppStore();
  const scrollRef = useRef(null);
  const recording = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  const [messages, setMessages] = useState([{
    role: 'aurora',
    text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm Aurora, your personal health companion. How are you feeling today? Speak or type to me!`
  }]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (listening || speaking || loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
      glowAnim.setValue(0.6);
    }
    return () => {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [listening, speaking, loading]);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: messageText.trim() }]);
    setInputText('');
    setLoading(true);
    scrollToBottom();

    try {
      const res = await chat(messageText);
      const reply = res.data.reply;
      setMessages(prev => [...prev, { role: 'aurora', text: reply }]);
      scrollToBottom();

      setSpeaking(true);
      Speech.speak(reply, {
        language: 'en-IN', pitch: 1.1, rate: 0.9,
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
      });
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'aurora',
        text: "I'm having trouble connecting right now. Please check your connection and try again! 🔄"
      }]);
      scrollToBottom();
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      Speech.stop();
      setSpeaking(false);

      if (recording.current) {
        try {
          const status = await recording.current.getStatusAsync();
          if (status.isRecording) await recording.current.stopAndUnloadAsync();
        } catch (e) {}
        recording.current = null;
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Microphone access is required for voice chat.');
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = rec;
      setListening(true);
    } catch (err) {
      console.log('Recording error:', err.message);
      recording.current = null;
      setListening(false);
    }
  };

  const stopRecording = async () => {
    if (!listening || !recording.current) {
      setListening(false);
      return;
    }
    setListening(false);
    setLoading(true);
    const rec = recording.current;
    recording.current = null;
    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      await sendMessage("Based on my health data today, give me a quick personalized summary and one actionable tip.");
    } catch (err) {
      setLoading(false);
    }
  };

  const handleOrbPressIn = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    startRecording();
  };

  const orbColor = listening ? '#FF5252' : speaking ? '#00D4AA' : loading ? '#FFB300' : '#6C63FF';
  const orbEmoji = listening ? '🎙️' : speaking ? '🔊' : loading ? '💭' : '✦';

  const getStatus = () => {
    if (listening) return '🔴 Listening... Release to send';
    if (loading) return '💭 Aurora is thinking...';
    if (speaking) return '🔊 Speaking... Tap to stop';
    return 'Hold to speak · Tap ⌨️ to type';
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <LinearGradient
        colors={isDark ? ['#0A0F1E', '#141927'] : ['#F0F4FF', '#FFFFFF']}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{
          paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
          alignItems: 'center', borderBottomWidth: 1, borderBottomColor: border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 36, height: 36, borderRadius: 18, backgroundColor: '#6C63FF',
              justifyContent: 'center', alignItems: 'center', marginRight: 10,
              shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4
            }}>
              <Text style={{ fontSize: 16 }}>✦</Text>
            </View>
            <View>
              <Text style={{ color: text, fontSize: 18, fontWeight: '800' }}>Aurora</Text>
              <Text style={{ color: '#00D4AA', fontSize: 11, fontWeight: '600' }}>● Online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg, i) => (
            <View key={i} style={{
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              marginBottom: 12, alignItems: 'flex-end'
            }}>
              {msg.role === 'aurora' && (
                <View style={{
                  width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C63FF',
                  justifyContent: 'center', alignItems: 'center', marginRight: 8,
                  shadowColor: '#6C63FF', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3
                }}>
                  <Text style={{ fontSize: 14 }}>✦</Text>
                </View>
              )}
              <View style={{
                maxWidth: '75%', padding: 14, borderRadius: 20,
                backgroundColor: msg.role === 'user' ? '#6C63FF' : card,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 20,
                borderBottomLeftRadius: msg.role === 'aurora' ? 4 : 20,
                shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
                borderWidth: msg.role === 'aurora' ? 1 : 0,
                borderColor: border
              }}>
                <Text style={{
                  color: msg.role === 'user' ? '#FFFFFF' : text,
                  fontSize: 15, lineHeight: 22
                }}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C63FF',
                justifyContent: 'center', alignItems: 'center', marginRight: 8
              }}>
                <Text style={{ fontSize: 14 }}>✦</Text>
              </View>
              <View style={{
                backgroundColor: card, padding: 14, borderRadius: 20,
                borderBottomLeftRadius: 4, borderWidth: 1, borderColor: border
              }}>
                <Text style={{ color: subtext, fontSize: 15 }}>Aurora is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 44, marginBottom: 8 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
        >
          {quickPrompts.map((prompt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => sendMessage(prompt)}
              disabled={loading || listening}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                backgroundColor: card, borderWidth: 1, borderColor: border,
                opacity: loading || listening ? 0.4 : 1
              }}
            >
              <Text style={{ color: subtext, fontSize: 12 }}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Text Input */}
        {showInput && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 16, paddingVertical: 10,
              backgroundColor: card, gap: 10,
              borderTopWidth: 1, borderTopColor: border
            }}>
              <TextInput
                value={inputText} onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={subtext}
                style={{
                  flex: 1, backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                  borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
                  color: text, fontSize: 15, maxHeight: 80
                }}
                multiline maxLength={500}
              />
              <TouchableOpacity
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim() || loading}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: inputText.trim() && !loading ? '#6C63FF' : isDark ? '#1E2A3A' : '#E2E8F4',
                  justifyContent: 'center', alignItems: 'center',
                  shadowColor: '#6C63FF', shadowOpacity: inputText.trim() ? 0.4 : 0, shadowRadius: 8, elevation: 4
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 20 }}>›</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Voice Controls */}
        <View style={{ alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 }}>
          <Text style={{ color: subtext, fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
            {getStatus()}
          </Text>

          {/* Orb */}
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', width: 160, height: 160 }}>
            <Animated.View style={{
              position: 'absolute', width: 160, height: 160, borderRadius: 80,
              backgroundColor: `${orbColor}10`, transform: [{ scale: pulseAnim }],
              opacity: glowAnim
            }} />
            <Animated.View style={{
              position: 'absolute', width: 120, height: 120, borderRadius: 60,
              backgroundColor: `${orbColor}20`, transform: [{ scale: pulseAnim }]
            }} />
            <TouchableOpacity
              onPressIn={handleOrbPressIn}
              onPressOut={stopRecording}
              disabled={loading}
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: orbColor,
                justifyContent: 'center', alignItems: 'center',
                shadowColor: orbColor, shadowOpacity: 0.7, shadowRadius: 20, elevation: 12,
                opacity: loading ? 0.7 : 1
              }}
            >
              <Text style={{ fontSize: 32 }}>{orbEmoji}</Text>
            </TouchableOpacity>
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => setShowInput(!showInput)}
              style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: showInput ? '#6C63FF' : card,
                justifyContent: 'center', alignItems: 'center',
                borderWidth: 1, borderColor: showInput ? '#6C63FF' : border
              }}
            >
              <Text style={{ fontSize: 20 }}>⌨️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMessages([{
                  role: 'aurora',
                  text: `Hi ${user?.name?.split(' ')[0] || 'there'}! How can I help you with your health today? 💪`
                }]);
                Speech.stop(); setSpeaking(false);
              }}
              style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: card, justifyContent: 'center', alignItems: 'center',
                borderWidth: 1, borderColor: border
              }}
            >
              <Text style={{ fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}