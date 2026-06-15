const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — allow all origins for mobile app
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '✅ Aurora Backend is Running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/hydration', require('./src/routes/hydration.routes'));
app.use('/api/sleep', require('./src/routes/sleep.routes'));
app.use('/api/habits', require('./src/routes/habit.routes'));
app.use('/api/nutrition', require('./src/routes/nutrition.routes'));
app.use('/api/companion', require('./src/routes/companion.routes'));
app.use('/api/dashboard', require('./src/routes/dashboard.routes'));
app.use('/api/memory', require('./src/routes/memory.routes'));
app.use('/api/streaks', require('./src/routes/streak.routes'));
app.use('/api/progress', require('./src/routes/progress.routes'));

app.get('/api/test/users', async (req, res) => {
  const User = require('./src/models/User');
  const users = await User.find().select('_id name email');
  res.json(users);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });