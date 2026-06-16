import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export default function Button({ title, onPress, loading = false, variant = 'primary', style = {} }) {
  const colors = {
    primary: { bg: '#6C63FF', text: '#FFFFFF' },
    secondary: { bg: '#1E2A3A', text: '#8B9CB6' },
    accent: { bg: '#00D4AA', text: '#FFFFFF' },
    danger: { bg: '#FF5252', text: '#FFFFFF' },
  };
  const color = colors[variant] || colors.primary;

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={[{
      backgroundColor: color.bg, borderRadius: 16, padding: 18,
      alignItems: 'center', opacity: loading ? 0.7 : 1,
      shadowColor: color.bg, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4
    }, style]}>
      {loading ? <ActivityIndicator color={color.text} /> :
        <Text style={{ color: color.text, fontSize: 16, fontWeight: '700' }}>{title}</Text>}
    </TouchableOpacity>
  );
}