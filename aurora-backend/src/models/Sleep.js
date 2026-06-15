const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  bedTime: { type: String, default: null },
  wakeTime: { type: String, default: null },
  duration: { type: Number, default: 0 },
  quality: { type: Number, default: 3, min: 1, max: 5 },
  notes: { type: String, default: '' }
}, { timestamps: true });

SleepSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Sleep', SleepSchema);