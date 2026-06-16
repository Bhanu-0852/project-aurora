import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function HabitItem({ habit, onComplete, onSkip, isCompleted }) {
  const { card, text, subtext, border, isDark } = useTheme();

  return (
    <View style={{
      backgroundColor: card, borderRadius: 18, padding: 16, marginBottom: 10,
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1.5, borderColor: isCompleted ? '#6C63FF40' : border
    }}>
      <View style={{
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: isCompleted ? '#6C63FF20' : isDark ? '#1E2A3A' : '#F0F4FF',
        justifyContent: 'center', alignItems: 'center', marginRight: 14
      }}>
        <Text style={{ fontSize: 26 }}>{habit.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: isCompleted ? subtext : text, fontWeight: '700', fontSize: 15, textDecorationLine: isCompleted ? 'line-through' : 'none' }}>
          {habit.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ color: subtext, fontSize: 12, textTransform: 'capitalize' }}>{habit.timeOfDay}</Text>
          {habit.streak > 0 && (
            <Text style={{ color: '#FFB300', fontSize: 12, marginLeft: 8, fontWeight: '700' }}>🔥 {habit.streak}</Text>
          )}
        </View>
      </View>
      {isCompleted ? (
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>✓</Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => onSkip(habit._id)} style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
            justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: border
          }}>
            <Text style={{ color: subtext, fontSize: 16 }}>—</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onComplete(habit._id)} style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF',
            justifyContent: 'center', alignItems: 'center',
            shadowColor: '#6C63FF', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4
          }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>✓</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}