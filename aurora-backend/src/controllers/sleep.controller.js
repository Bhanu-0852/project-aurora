const Sleep = require('../models/Sleep');

const logSleep = async (req, res) => {
  try {
    const { bedTime, wakeTime, duration, quality, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    let sleep = await Sleep.findOne({ userId: req.user.userId, date: today });
    if (sleep) {
      sleep.bedTime = bedTime;
      sleep.wakeTime = wakeTime;
      sleep.duration = duration;
      sleep.quality = quality;
      sleep.notes = notes;
    } else {
      sleep = new Sleep({
        userId: req.user.userId,
        date: today,
        bedTime, wakeTime, duration, quality, notes
      });
    }
    await sleep.save();
    res.json(sleep);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Sleep.find({ userId: req.user.userId })
      .sort({ date: -1 }).limit(7);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const history = await Sleep.find({ userId: req.user.userId })
      .sort({ date: -1 }).limit(30);
    const avgDuration = history.reduce((sum, s) => sum + (s.duration || 0), 0) / (history.length || 1);
    const lastNight = history[0] || null;
    res.json({ avgDuration: avgDuration.toFixed(1), lastNight, history });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { logSleep, getHistory, getAnalytics };