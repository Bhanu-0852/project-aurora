const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Hydration = require('./src/models/Hydration');
const Sleep = require('./src/models/Sleep');
const Habit = require('./src/models/Habit');
const Nutrition = require('./src/models/Nutrition');

const SEED_USER_ID = '6a2d76d6f1a0b291ec26175d';

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  for (const date of dates) {
    // Hydration
    const total = Math.floor(Math.random() * 1000) + 1800;
    await Hydration.findOneAndUpdate(
      { userId: SEED_USER_ID, date },
      { userId: SEED_USER_ID, date, goal: 2500, total, logs: [{ amount: total, time: new Date() }] },
      { upsert: true, returnDocument: 'after' }
    );

    // Sleep
    const duration = parseFloat((Math.random() * 2.5 + 6).toFixed(1));
    await Sleep.findOneAndUpdate(
      { userId: SEED_USER_ID, date },
      { userId: SEED_USER_ID, date, duration, quality: Math.floor(Math.random() * 2) + 3 },
      { upsert: true, returnDocument: 'after' }
    );

    // Nutrition
    const calories = Math.floor(Math.random() * 600) + 1400;
    await Nutrition.findOneAndUpdate(
      { userId: SEED_USER_ID, date },
      {
        userId: SEED_USER_ID, date,
        meals: [
          { type: 'breakfast', name: 'Oats with milk', calories: 350, protein: 12, carbs: 60, fat: 6 },
          { type: 'lunch', name: 'Rice and dal', calories: 550, protein: 20, carbs: 90, fat: 8 },
          { type: 'dinner', name: 'Chapati with vegetables', calories: calories - 900, protein: 15, carbs: 50, fat: 10 },
        ],
        totalCalories: calories, totalProtein: 47, totalCarbs: 200, totalFat: 24
      },
      { upsert: true, returnDocument: 'after' }
    );
  }

  // Create 3 habits with streaks
  const habitDefs = [
    { name: 'Morning Meditation', icon: '🧘', timeOfDay: 'morning' },
    { name: 'Evening Walk', icon: '🚶', timeOfDay: 'evening' },
    { name: 'Read 20 Pages', icon: '📚', timeOfDay: 'evening' },
  ];

  for (const def of habitDefs) {
    const logs = dates.map(date => ({ date, completed: Math.random() > 0.2 }));
    await Habit.findOneAndUpdate(
      { userId: SEED_USER_ID, name: def.name },
      { userId: SEED_USER_ID, ...def, streak: 5, longestStreak: 7, status: 'active', logs },
      { upsert: true, returnDocument: 'after' }
    );
  }

  console.log('✅ Seed complete!');
  process.exit(0);
};

seedData().catch(console.error);