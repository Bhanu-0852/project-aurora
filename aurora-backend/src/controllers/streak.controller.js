const Hydration = require('../models/Hydration');
const Sleep = require('../models/Sleep');
const Habit = require('../models/Habit');
const Nutrition = require('../models/Nutrition');

const getStreaks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    let hydrationStreak = 0;
    for (const date of dates) {
      const h = await Hydration.findOne({ userId, date });
      if (h && h.total >= h.goal) hydrationStreak++;
      else break;
    }

    let sleepStreak = 0;
    for (const date of dates) {
      const s = await Sleep.findOne({ userId, date });
      if (s && s.duration >= 7) sleepStreak++;
      else break;
    }

    const habits = await Habit.find({ userId, status: 'active' });
    const maxHabitStreak = habits.length > 0
      ? Math.max(...habits.map(h => h.streak))
      : 0;

    let nutritionStreak = 0;
    for (const date of dates) {
      const n = await Nutrition.findOne({ userId, date });
      if (n && n.meals.length > 0) nutritionStreak++;
      else break;
    }

    res.json({
      hydration: hydrationStreak,
      sleep: sleepStreak,
      habits: maxHabitStreak,
      nutrition: nutritionStreak,
      total: hydrationStreak + sleepStreak + maxHabitStreak + nutritionStreak
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStreaks };