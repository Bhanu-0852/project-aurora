const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  height: { type: Number, default: null },
  weight: { type: Number, default: null },
  wakeTime: { type: String, default: '6:00 AM' },
  bedTime: { type: String, default: '10:00 PM' },
  activityLevel: { type: String, default: 'moderate', enum: ['sedentary', 'light', 'moderate', 'active'] },
  goals: { type: [String], default: [] },
  notifications: {
    hydration: { type: Boolean, default: true },
    sleep: { type: Boolean, default: true },
    habits: { type: Boolean, default: true },
    insights: { type: Boolean, default: true }
  },
  dailyWaterGoal: { type: Number, default: 2500 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);