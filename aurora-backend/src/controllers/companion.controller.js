const { chat } = require('../services/gemini.service');
const Hydration = require('../models/Hydration');
const Sleep = require('../models/Sleep');
const Habit = require('../models/Habit');
const Nutrition = require('../models/Nutrition');
const User = require('../models/User');

const executeAction = async (action, userId, today) => {
  try {
    if (action.type === 'log_hydration') {
      let hydration = await Hydration.findOne({ userId, date: today });
      if (!hydration) {
        hydration = new Hydration({ userId, date: today, goal: 2500, logs: [], total: 0 });
      }
      hydration.logs.push({ amount: action.amount, time: new Date() });
      hydration.total += action.amount;
      await hydration.save();
    }
    if (action.type === 'log_sleep') {
      let sleep = await Sleep.findOne({ userId, date: today });
      if (!sleep) sleep = new Sleep({ userId, date: today });
      sleep.duration = action.duration;
      await sleep.save();
    }
    if (action.type === 'create_habit') {
      const habit = new Habit({
        userId,
        name: action.name,
        timeOfDay: action.timeOfDay || 'morning'
      });
      await habit.save();
    }
    if (action.type === 'log_meal') {
      let nutrition = await Nutrition.findOne({ userId, date: today });
      if (!nutrition) {
        nutrition = new Nutrition({ userId, date: today, meals: [] });
      }
      nutrition.meals.push({
        type: action.mealType,
        name: action.name,
        calories: action.calories || 0
      });
      nutrition.totalCalories += action.calories || 0;
      await nutrition.save();
    }
  } catch (err) {
    console.log('Action execution error:', err);
  }
};

const chatWithAurora = async (req, res) => {
  try {
    const { message } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    const sleep = await Sleep.findOne({ userId: req.user.userId, date: today });
    const habits = await Habit.find({ userId: req.user.userId, status: 'active' });
    const nutrition = await Nutrition.findOne({ userId: req.user.userId, date: today });

    const completedHabits = habits.filter(h =>
      h.logs.some(l => l.date === today && l.completed)
    ).length;

    const healthData = {
      name: user.name,
      hydration: hydration?.total || 0,
      hydrationGoal: hydration?.goal || 2500,
      sleep: sleep?.duration || 0,
      habitsCompleted: completedHabits,
      totalHabits: habits.length,
      calories: nutrition?.totalCalories || 0
    };

    const { text, action } = await chat(message, healthData);
    if (action) await executeAction(action, req.user.userId, today);
    res.json({ reply: text, action });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const voiceChat = async (req, res) => {
  try {
    const { transcript } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    const hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    const sleep = await Sleep.findOne({ userId: req.user.userId, date: today });
    const habits = await Habit.find({ userId: req.user.userId, status: 'active' });
    const nutrition = await Nutrition.findOne({ userId: req.user.userId, date: today });

    const completedHabits = habits.filter(h =>
      h.logs.some(l => l.date === today && l.completed)
    ).length;

    const healthData = {
      name: user.name,
      hydration: hydration?.total || 0,
      hydrationGoal: hydration?.goal || 2500,
      sleep: sleep?.duration || 0,
      habitsCompleted: completedHabits,
      totalHabits: habits.length,
      calories: nutrition?.totalCalories || 0
    };

    const { text, action } = await chat(transcript, healthData);
    if (action) await executeAction(action, req.user.userId, today);
    res.json({ reply: text, action });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { chatWithAurora, voiceChat };