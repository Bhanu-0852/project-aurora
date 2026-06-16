import { Tabs } from 'expo-router';
import { useColorScheme, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../../store/useStore';

const ICONS = {
  home: ['home', 'home-outline'],
  hydration: ['water', 'water-outline'],
  sleep: ['moon', 'moon-outline'],
  habits: ['flash', 'flash-outline'],
  nutrition: ['restaurant', 'restaurant-outline'],
  companion: ['sparkles', 'sparkles-outline'],
  progress: ['stats-chart', 'stats-chart-outline'],
  profile: ['person', 'person-outline'],
};

const LABELS = {
  home: 'Home', hydration: 'Water', sleep: 'Sleep', habits: 'Habits',
  nutrition: 'Food', companion: 'Aurora', progress: 'Progress', profile: 'Profile',
};

function TabBarIcon({ routeName, focused, isDark }) {
  const [filled, outline] = ICONS[routeName];
  const isCompanion = routeName === 'companion';

  // Active = purple. Companion stays lightly highlighted even when inactive.
  let color = focused
    ? '#6C63FF'
    : isCompanion
      ? '#8B85FF'
      : isDark ? '#5B6B85' : '#9AA6BC';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 60, paddingTop: 8 }}>
      <Ionicons name={focused ? filled : outline} size={focused ? 23 : 21} color={color} />
      <Text
        numberOfLines={1}
        style={{ color, fontSize: 9.5, fontWeight: focused ? '800' : '600', marginTop: 4 }}
      >
        {LABELS[routeName]}
      </Text>
      {/* active pill under the focused tab */}
      <View style={{
        width: focused ? 16 : 0, height: 3, borderRadius: 2,
        backgroundColor: '#6C63FF', marginTop: 4
      }} />
    </View>
  );
}

export default function TabLayout() {
  const systemScheme = useColorScheme();
  const theme = useAppStore((state) => state.theme);
  const activeScheme = theme === 'system' ? systemScheme : theme;
  const isDark = activeScheme === 'dark';

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: isDark ? '#0E1422' : '#FFFFFF',
        borderTopColor: isDark ? '#1E2A3A' : '#E2E8F4',
        borderTopWidth: 1,
        height: 84,
        paddingTop: 6,
        paddingBottom: 16,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.4 : 0.08,
        shadowRadius: 16,
      },
    }}>
      {Object.keys(ICONS).map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon routeName={name} focused={focused} isDark={isDark} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}