const Memory = require('../models/Memory');

const getMemory = async (req, res) => {
  try {
    let memory = await Memory.findOne({ userId: req.user.userId });
    if (!memory) {
      memory = new Memory({
        userId: req.user.userId,
        observations: [],
        summary: ''
      });
      await memory.save();
    }
    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addObservation = async (req, res) => {
  try {
    const { text } = req.body;
    let memory = await Memory.findOne({ userId: req.user.userId });
    if (!memory) {
      memory = new Memory({
        userId: req.user.userId,
        observations: [],
        summary: ''
      });
    }
    memory.observations.push({ text, createdAt: new Date() });
    if (memory.observations.length > 20) {
      memory.observations = memory.observations.slice(-20);
    }
    memory.summary = memory.observations.map(o => o.text).join('. ');
    memory.updatedAt = new Date();
    await memory.save();
    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMemory, addObservation };