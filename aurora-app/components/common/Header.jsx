import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function Header({ title, showBack = false, rightIcon = null, onRightPress = null }) {
  const { card, text, subtext, border } = useTheme();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16
    }}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: card, justifyContent: 'center', alignItems: 'center',
          borderWidth: 1, borderColor: border
        }}>
          <Text style={{ color: text, fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 40 }} />}
      <Text style={{ color: text, fontSize: 18, fontWeight: '800' }}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: card, justifyContent: 'center', alignItems: 'center',
          borderWidth: 1, borderColor: border
        }}>
          <Text style={{ fontSize: 20 }}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 40 }} />}
    </View>
  );
}