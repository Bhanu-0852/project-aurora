import { View, Text, TouchableOpacity} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const amounts = [150, 250, 350, 500];

export default function QuickAddButtons({ onAdd }) {
  const { isDark, card, text, border } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {amounts.map((amount) => (
        <TouchableOpacity key={amount} onPress={() => onAdd(amount)} style={{
          flex: 1, backgroundColor: card, borderRadius: 12, padding: 16,
          alignItems: 'center', borderWidth: 1,
          borderColor: isDark ? '#1E2A3A' : '#E8ECF4'
        }}>
          <Text style={{ fontSize: 18 }}>💧</Text>
          <Text style={{ color: text, fontSize: 13, fontWeight: '600', marginTop: 4 }}>{amount}ml</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}