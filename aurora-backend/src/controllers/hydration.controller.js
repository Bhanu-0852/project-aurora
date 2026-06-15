const Hydration = require('../models/Hydration');
const User = require('../models/User');

const getToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    let hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    if (!hydration) {
      hydration = new Hydration({
        userId: req.user.userId,
        date: today,
        goal: user.dailyWaterGoal || 2500,
        logs: [],
        total: 0
      });
      await hydration.save();
    }
    res.json(hydration);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const logWater = async (req, res) => {
  try {
    const { amount } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.userId);
    let hydration = await Hydration.findOne({ userId: req.user.userId, date: today });
    if (!hydration) {
      hydration = new Hydration({
        userId: req.user.userId,
        date: today,
        goal: user.dailyWaterGoal || 2500,
        logs: [],
        total: 0
      });
    }
    hydration.logs.push({ amount, time: new Date() });
    hydration.total += amount;
    await hydration.save();
    res.json(hydration);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Hydration.find({ userId: req.user.userId })
      .sort({ date: -1 }).limit(7);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getToday, logWater, getHistory };