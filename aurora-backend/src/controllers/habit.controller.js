const Habit = require('../models/Habit');

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId, status: 'active' });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, icon, timeOfDay, frequency } = req.body;
    const habit = new Habit({
      userId: req.user.userId,
      name, icon, timeOfDay, frequency
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const completeHabit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const existingLog = habit.logs.find(l => l.date === today);
    if (existingLog) {
      existingLog.completed = true;
    } else {
      habit.logs.push({ date: today, completed: true });
    }
    habit.streak += 1;
    if (habit.streak > habit.longestStreak) habit.longestStreak = habit.streak;
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const skipHabit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    habit.logs.push({ date: today, skipped: true });
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const pauseHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { status: 'paused' },
      { returnDocument: 'after' }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const editHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getHabits, createHabit, completeHabit, skipHabit, pauseHabit, editHabit, deleteHabit };