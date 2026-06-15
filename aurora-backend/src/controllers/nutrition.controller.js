const Nutrition = require('../models/Nutrition');

const getToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let nutrition = await Nutrition.findOne({ userId: req.user.userId, date: today });
    if (!nutrition) {
      nutrition = new Nutrition({
        userId: req.user.userId,
        date: today,
        meals: []
      });
      await nutrition.save();
    }
    res.json(nutrition);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const logMeal = async (req, res) => {
  try {
    const { type, name, calories, protein, carbs, fat } = req.body;
    const today = new Date().toISOString().split('T')[0];
    let nutrition = await Nutrition.findOne({ userId: req.user.userId, date: today });
    if (!nutrition) {
      nutrition = new Nutrition({
        userId: req.user.userId,
        date: today,
        meals: []
      });
    }
    nutrition.meals.push({ type, name, calories, protein, carbs, fat });
    nutrition.totalCalories += calories || 0;
    nutrition.totalProtein += protein || 0;
    nutrition.totalCarbs += carbs || 0;
    nutrition.totalFat += fat || 0;
    await nutrition.save();
    res.json(nutrition);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getToday, logMeal };