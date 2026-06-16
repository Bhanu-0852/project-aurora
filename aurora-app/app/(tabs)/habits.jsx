import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, TextInput, Alert
} from 'react-native';
import { getHabits, createHabit, completeHabit, skipHabit, deleteHabit } from '../../services/habit.service';
import { useTheme } from '../../hooks/useTheme';

const habitIcons = ['📚', '🧘', '🏃', '💪', '✍️', '💊', '🛏️', '🎯', '🌿', '🎨', '🧴', '🚴'];
const timeOptions = [
  { key: 'morning', label: 'Morning', icon: '🌅' },
  { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { key: 'evening', label: 'Evening', icon: '🌙' },
];

export default function Habits() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const today = new Date().toISOString().split('T')[0];

  const loadHabits = async () => {
    try {
      const res = await getHabits();
      setHabits(res.data);
    } catch (err) {
      console.log('Habits error:', err.message);
    }
  };

  useEffect(() => { loadHabits(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('Missing Name', 'Please enter a habit name'); return; }
    try {
      await createHabit({ name: name.trim(), icon, timeOfDay });
      setShowModal(false);
      setName(''); setIcon('📚'); setTimeOfDay('morning');
      await loadHabits();
    } catch (err) {
      Alert.alert('Error', 'Failed to create habit');
    }
  };

  const handleComplete = async (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await completeHabit(id);
      await loadHabits();
      // Check if all done
      const updated = await getHabits();
      const allDone = updated.data.every(h => isCompleted(h));
      if (allDone && updated.data.length > 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) { Alert.alert('Error', 'Failed'); }
  };

  const handleSkip = async (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await skipHabit(id);
      await loadHabits();
    } catch (err) { Alert.alert('Error', 'Failed'); }
  };

  const isCompleted = (habit) => habit.logs.some(l => l.date === today && l.completed);
  const completedCount = habits.filter(h => isCompleted(h)).length;
  const completionPct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: text, fontSize: 28, fontWeight: '800' }}>⚡ Habits</Text>
          <TouchableOpacity onPress={() => setShowModal(true)} style={{
            backgroundColor: '#6C63FF', borderRadius: 14,
            paddingHorizontal: 16, paddingVertical: 10,
            shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 10, elevation: 6
          }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>+ New</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: subtext, fontSize: 14, marginBottom: 24 }}>
          {completedCount}/{habits.length} completed today
        </Text>

        {/* Progress */}
        <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, fontWeight: '700' }}>TODAY'S PROGRESS</Text>
            <Text style={{ color: '#6C63FF', fontWeight: '800', fontSize: 16 }}>{completionPct}%</Text>
          </View>
          <View style={{ height: 10, backgroundColor: isDark ? '#1E2A3A' : '#E2E8F4', borderRadius: 5 }}>
            <View style={{ height: 10, width: `${completionPct}%`, backgroundColor: '#6C63FF', borderRadius: 5 }} />
          </View>
          {completionPct === 100 && (
            <Text style={{ color: '#00D4AA', fontSize: 13, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>
              🎉 All habits completed!
            </Text>
          )}
        </View>

        {/* Empty State */}
        {habits.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 48 }}>
            <Text style={{ fontSize: 56, marginBottom: 16 }}>⚡</Text>
            <Text style={{ color: text, fontSize: 20, fontWeight: '800', marginBottom: 8 }}>No habits yet</Text>
            <Text style={{ color: subtext, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
              Create your first habit to start building consistency
            </Text>
            <TouchableOpacity onPress={() => setShowModal(true)} style={{
              backgroundColor: '#6C63FF', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14,
              marginTop: 24,
              shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6
            }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Create First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          habits.map((habit) => {
            const done = isCompleted(habit);
            return (
              <View key={habit._id} style={{
                backgroundColor: card, borderRadius: 18, padding: 16, marginBottom: 10,
                flexDirection: 'row', alignItems: 'center',
                borderWidth: 1.5, borderColor: done ? '#6C63FF40' : border
              }}>
                <View style={{
                  width: 52, height: 52, borderRadius: 16,
                  backgroundColor: done ? '#6C63FF20' : isDark ? '#1E2A3A' : '#F0F4FF',
                  justifyContent: 'center', alignItems: 'center', marginRight: 14
                }}>
                  <Text style={{ fontSize: 26 }}>{habit.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: done ? subtext : text,
                    fontWeight: '700', fontSize: 15,
                    textDecorationLine: done ? 'line-through' : 'none'
                  }}>
                    {habit.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={{ color: subtext, fontSize: 12, textTransform: 'capitalize' }}>
                      {habit.timeOfDay}
                    </Text>
                    {habit.streak > 0 && (
                      <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: '#FFB30020', borderRadius: 8,
                        paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8
                      }}>
                        <Text style={{ color: '#FFB300', fontSize: 11, fontWeight: '700' }}>
                          🔥 {habit.streak}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {done ? (
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>✓</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={() => handleSkip(habit._id)} style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                      justifyContent: 'center', alignItems: 'center',
                      borderWidth: 1, borderColor: border
                    }}>
                      <Text style={{ color: subtext, fontSize: 16 }}>—</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleComplete(habit._id)} style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
                      shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4
                    }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>✓</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create Habit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{
            backgroundColor: isDark ? '#141927' : '#FFFFFF',
            borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28,
            paddingBottom: 40
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ color: text, fontSize: 20, fontWeight: '800' }}>Create New Habit</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: subtext, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: subtext, fontSize: 11, marginBottom: 8, letterSpacing: 2, fontWeight: '700' }}>HABIT NAME</Text>
            <TextInput
              value={name} onChangeText={setName}
              placeholder="e.g. Morning Meditation"
              placeholderTextColor={subtext}
              style={{
                backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                borderRadius: 14, padding: 16, color: text, marginBottom: 20, fontSize: 16
              }}
            />

            <Text style={{ color: subtext, fontSize: 11, marginBottom: 12, letterSpacing: 2, fontWeight: '700' }}>CHOOSE ICON</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {habitIcons.map((ic) => (
                <TouchableOpacity key={ic} onPress={() => setIcon(ic)} style={{
                  width: 48, height: 48, borderRadius: 14, marginRight: 8,
                  justifyContent: 'center', alignItems: 'center',
                  backgroundColor: icon === ic ? '#6C63FF' : isDark ? '#1E2A3A' : '#F0F4FF',
                  borderWidth: icon === ic ? 2 : 1,
                  borderColor: icon === ic ? '#6C63FF' : border
                }}>
                  <Text style={{ fontSize: 24 }}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ color: subtext, fontSize: 11, marginBottom: 12, letterSpacing: 2, fontWeight: '700' }}>TIME OF DAY</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
              {timeOptions.map((t) => (
                <TouchableOpacity key={t.key} onPress={() => setTimeOfDay(t.key)} style={{
                  flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center',
                  backgroundColor: timeOfDay === t.key ? '#6C63FF' : isDark ? '#1E2A3A' : '#F0F4FF',
                  borderWidth: 1, borderColor: timeOfDay === t.key ? '#6C63FF' : border
                }}>
                  <Text style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</Text>
                  <Text style={{
                    color: timeOfDay === t.key ? '#FFFFFF' : subtext,
                    fontWeight: '700', fontSize: 12
                  }}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{
                flex: 1, padding: 16, borderRadius: 16, alignItems: 'center',
                backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF'
              }}>
                <Text style={{ color: subtext, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={{
                flex: 1, padding: 16, borderRadius: 16, alignItems: 'center',
                backgroundColor: '#6C63FF',
                shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6
              }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Create Habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}