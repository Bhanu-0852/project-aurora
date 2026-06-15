const Hydration = require('../models/Hydration');
const Sleep = require('../models/Sleep');
const Habit = require('../models/Habit');
const Nutrition = require('../models/Nutrition');

const getWeeklyReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const hydrationData = await Promise.all(
      dates.map(async (date) => {
        const h = await Hydration.findOne({ userId, date });
        return { date, total: h?.total || 0, goal: h?.goal || 2500 };
      })
    );

    const sleepData = await Promise.all(
      dates.map(async (date) => {
        const s = await Sleep.findOne({ userId, date });
        return { date, duration: s?.duration || 0 };
      })
    );

    const habits = await Habit.find({ userId, status: 'active' });
    const habitData = dates.map((date) => {
      const completed = habits.filter(h =>
        h.logs.some(l => l.date === date && l.completed)
      ).length;
      return { date, completed, total: habits.length };
    });

    const nutritionData = await Promise.all(
      dates.map(async (date) => {
        const n = await Nutrition.findOne({ userId, date });
        return { date, calories: n?.totalCalories || 0, meals: n?.meals?.length || 0 };
      })
    );

    const avgSleep = sleepData.reduce((s, d) => s + d.duration, 0) / 7;
    const avgHydration = hydrationData.reduce((s, d) => s + d.total, 0) / 7;
    const avgCalories = nutritionData.reduce((s, d) => s + d.calories, 0) / 7;

    res.json({
      dates,
      hydration: hydrationData,
      sleep: sleepData,
      habits: habitData,
      nutrition: nutritionData,
      averages: {
        sleep: avgSleep.toFixed(1),
        hydration: Math.round(avgHydration),
        calories: Math.round(avgCalories)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const hydrationData = await Promise.all(
      dates.map(async (date) => {
        const h = await Hydration.findOne({ userId, date });
        return { date, total: h?.total || 0, goal: h?.goal || 2500 };
      })
    );

    const sleepData = await Promise.all(
      dates.map(async (date) => {
        const s = await Sleep.findOne({ userId, date });
        return { date, duration: s?.duration || 0 };
      })
    );

    const daysWithData = hydrationData.filter(d => d.total > 0).length;
    const consistencyScore = Math.round((daysWithData / 30) * 100);

    res.json({
      hydration: hydrationData,
      sleep: sleepData,
      consistencyScore,
      totalDays: 30,
      activeDays: daysWithData
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getWeeklyReport, getMonthlyReport };