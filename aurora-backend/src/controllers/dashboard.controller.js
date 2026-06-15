const User = require('../models/User');
const Hydration = require('../models/Hydration');
const Sleep = require('../models/Sleep');
const Habit = require('../models/Habit');
const Nutrition = require('../models/Nutrition');
const { chat } = require('../services/gemini.service');

const getSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId).select('-password');
    const hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    const sleep = await Sleep.findOne({ userId: req.user.userId, date: today });
    const habits = await Habit.find({ userId: req.user.userId, status: 'active' });
    const nutrition = await Nutrition.findOne({ userId: req.user.userId, date: today });
    const completedHabits = habits.filter(h =>
      h.logs.some(l => l.date === today && l.completed)
    ).length;

    res.json({
      user,
      hydration: { total: hydration?.total || 0, goal: hydration?.goal || 2500 },
      sleep: { duration: sleep?.duration || 0 },
      habits: { total: habits.length, completed: completedHabits },
      nutrition: { calories: nutrition?.totalCalories || 0 }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDailyInsight = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    const sleep = await Sleep.findOne({ userId: req.user.userId, date: today });
    const habits = await Habit.find({ userId: req.user.userId, status: 'active' });
    const completedHabits = habits.filter(h =>
      h.logs.some(l => l.date === today && l.completed)
    ).length;

    const hydrationPct = hydration ? (hydration.total / hydration.goal) * 100 : 0;
    const sleepHours = sleep?.duration || 0;

    let insight = '';

    try {
      const healthData = {
        name: user.name,
        hydration: hydration?.total || 0,
        hydrationGoal: hydration?.goal || 2500,
        sleep: sleepHours,
        habitsCompleted: completedHabits,
        totalHabits: habits.length,
        calories: 0
      };
      const result = await chat(
        'Give me one short personalized health insight in one sentence.',
        healthData
      );
      insight = result.text;
    } catch (aiError) {
      if (hydrationPct < 50) {
        insight = `You've had ${hydration?.total || 0}ml today — drink more water to boost your energy!`;
      } else if (sleepHours < 7) {
        insight = `Aim for 7-8 hours of sleep tonight to help your body recover and perform better.`;
      } else if (completedHabits < habits.length / 2) {
        insight = `You have ${habits.length - completedHabits} habits remaining today — keep pushing!`;
      } else {
        insight = `Great job staying consistent with your health today, ${user.name}! Keep it up!`;
      }
    }

    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getSummary, getDailyInsight };