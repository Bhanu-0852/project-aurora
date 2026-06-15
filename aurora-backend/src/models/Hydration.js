const mongoose = require('mongoose');

const HydrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  goal: { type: Number, default: 2500 },
  logs: [{
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now }
  }],
  total: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index for faster queries
HydrationSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Hydration', HydrationSchema)