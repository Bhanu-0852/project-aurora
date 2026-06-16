import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, TextInput, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getToday, logMeal } from '../../services/nutrition.service';
import { useTheme } from '../../hooks/useTheme';

const mealTypes = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '☀️' },
  { key: 'dinner', label: 'Dinner', icon: '🌙' },
  { key: 'snack', label: 'Snack', icon: '🍎' },
];

export default function Nutrition() {
  const { isDark, bg, card, text, subtext, border } = useTheme();
  const [nutrition, setNutrition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const loadData = async () => {
    try {
      const res = await getToday();
      setNutrition(res.data);
    } catch (err) {
      console.log('Nutrition error:', err.message);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLog = async () => {
    if (!mealName.trim()) { Alert.alert('Missing Name', 'Please enter a meal name'); return; }
    try {
      await logMeal({
        type: mealType, name: mealName.trim(),
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
      });
      setShowModal(false);
      setMealName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
      await loadData();
    } catch (err) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  const macros = [
    { label: 'Protein', value: nutrition?.totalProtein || 0, unit: 'g', color: '#6C63FF' },
    { label: 'Carbs', value: nutrition?.totalCarbs || 0, unit: 'g', color: '#00D4AA' },
    { label: 'Fat', value: nutrition?.totalFat || 0, unit: 'g', color: '#FFB300' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: text, fontSize: 28, fontWeight: '800' }}>🥗 Nutrition</Text>
          <TouchableOpacity onPress={() => setShowModal(true)} style={{
            backgroundColor: '#00D4AA', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
            shadowColor: '#00D4AA', shadowOpacity: 0.4, shadowRadius: 10, elevation: 6
          }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>+ Log Meal</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: subtext, fontSize: 14, marginBottom: 24 }}>Awareness over perfection</Text>

        {/* Calories Card */}
        <LinearGradient
          colors={isDark ? ['#0D2020', '#141927'] : ['#E6FFF8', '#FFFFFF']}
          style={{ borderRadius: 20, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#00D4AA30' }}
        >
          <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 8, fontWeight: '700' }}>CALORIES TODAY</Text>
          <Text style={{ color: text, fontSize: 52, fontWeight: '800' }}>{nutrition?.totalCalories || 0}</Text>
          <Text style={{ color: subtext, fontSize: 14 }}>kcal consumed</Text>
        </LinearGradient>

        {/* Macros */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {macros.map((m) => (
            <View key={m.label} style={{
              flex: 1, backgroundColor: card, borderRadius: 16, padding: 16, alignItems: 'center',
              borderWidth: 1, borderColor: border
            }}>
              <Text style={{ color: m.color, fontSize: 22, fontWeight: '800' }}>{m.value}{m.unit}</Text>
              <Text style={{ color: subtext, fontSize: 11, marginTop: 4, fontWeight: '600' }}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Meals */}
        <Text style={{ color: subtext, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' }}>TODAY'S MEALS</Text>
        {nutrition?.meals?.length > 0 ? (
          nutrition.meals.map((meal, i) => {
            const mealInfo = mealTypes.find(m => m.key === meal.type) || mealTypes[3];
            return (
              <View key={i} style={{
                backgroundColor: card, borderRadius: 16, padding: 16, marginBottom: 8,
                flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: border
              }}>
                <View style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: isDark ? '#1E2A3A' : '#F0FFF8',
                  justifyContent: 'center', alignItems: 'center', marginRight: 14
                }}>
                  <Text style={{ fontSize: 24 }}>{mealInfo.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: text, fontWeight: '700', fontSize: 15 }}>{meal.name}</Text>
                  <Text style={{ color: subtext, fontSize: 12, marginTop: 2, textTransform: 'capitalize' }}>
                    {meal.type} · {meal.protein || 0}g protein · {meal.carbs || 0}g carbs
                  </Text>
                </View>
                <Text style={{ color: '#00D4AA', fontWeight: '800', fontSize: 16 }}>
                  {meal.calories}
                </Text>
                <Text style={{ color: subtext, fontSize: 11, marginLeft: 2 }}>kcal</Text>
              </View>
            );
          })
        ) : (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🥗</Text>
            <Text style={{ color: text, fontSize: 18, fontWeight: '700' }}>No meals logged</Text>
            <Text style={{ color: subtext, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
              Start tracking your meals to build nutritional awareness
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Log Meal Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <ScrollView style={{
            backgroundColor: isDark ? '#141927' : '#FFFFFF',
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 28, maxHeight: '85%'
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ color: text, fontSize: 20, fontWeight: '800' }}>Log a Meal</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: subtext, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: subtext, fontSize: 11, marginBottom: 12, letterSpacing: 2, fontWeight: '700' }}>MEAL TYPE</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              {mealTypes.map((t) => (
                <TouchableOpacity key={t.key} onPress={() => setMealType(t.key)} style={{
                  flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center',
                  backgroundColor: mealType === t.key ? '#00D4AA' : isDark ? '#1E2A3A' : '#F0F4FF',
                  borderWidth: 1, borderColor: mealType === t.key ? '#00D4AA' : border
                }}>
                  <Text style={{ fontSize: 18 }}>{t.icon}</Text>
                  <Text style={{
                    color: mealType === t.key ? '#FFFFFF' : subtext,
                    fontSize: 10, marginTop: 4, fontWeight: '700'
                  }}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {[
              { label: 'MEAL NAME', value: mealName, setter: setMealName, placeholder: 'e.g. Oats with milk', numeric: false },
              { label: 'CALORIES (kcal)', value: calories, setter: setCalories, placeholder: '300', numeric: true },
              { label: 'PROTEIN (g)', value: protein, setter: setProtein, placeholder: '15', numeric: true },
              { label: 'CARBS (g)', value: carbs, setter: setCarbs, placeholder: '45', numeric: true },
              { label: 'FAT (g)', value: fat, setter: setFat, placeholder: '8', numeric: true },
            ].map((field) => (
              <View key={field.label} style={{ marginBottom: 14 }}>
                <Text style={{ color: subtext, fontSize: 11, marginBottom: 8, letterSpacing: 2, fontWeight: '700' }}>{field.label}</Text>
                <TextInput
                  value={field.value} onChangeText={field.setter}
                  placeholder={field.placeholder} placeholderTextColor={subtext}
                  keyboardType={field.numeric ? 'numeric' : 'default'}
                  style={{
                    backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF',
                    borderRadius: 14, padding: 14, color: text, fontSize: 16
                  }}
                />
              </View>
            ))}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 40 }}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{
                flex: 1, padding: 16, borderRadius: 16, alignItems: 'center',
                backgroundColor: isDark ? '#1E2A3A' : '#F0F4FF'
              }}>
                <Text style={{ color: subtext, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLog} style={{
                flex: 1, padding: 16, borderRadius: 16, alignItems: 'center',
                backgroundColor: '#00D4AA',
                shadowColor: '#00D4AA', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6
              }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Log Meal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}