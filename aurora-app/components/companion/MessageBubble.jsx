import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function MessageBubble({ message, isUser = false }) {
  const { card, text, subtext, border } = useTheme();
  return (
    <View style={{
      flexDirection: isUser ? 'row-reverse' : 'row',
      marginBottom: 12, alignItems: 'flex-end', paddingHorizontal: 4
    }}>
      {!isUser && (
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
        backgroundColor: isUser ? '#6C63FF' : card,
        borderBottomRightRadius: isUser ? 4 : 20,
        borderBottomLeftRadius: isUser ? 20 : 4,
        borderWidth: isUser ? 0 : 1, borderColor: border,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2
      }}>
        <Text style={{ color: isUser ? '#FFFFFF' : text, fontSize: 15, lineHeight: 22 }}>
          {message.text}
        </Text>
        <Text style={{ color: isUser ? 'rgba(255,255,255,0.5)' : subtext, fontSize: 10, marginTop: 6, textAlign: isUser ? 'right' : 'left' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}