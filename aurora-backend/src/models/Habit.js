const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, default: '⭐' },
  timeOfDay: {
    type: String,
    default: 'morning',
    enum: ['morning', 'afternoon', 'evening', 'anytime']
  },
  frequency: { type: String, default: 'daily' },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'paused', 'archived']
  },
  logs: [{
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

HabitSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Habit', HabitSchema);