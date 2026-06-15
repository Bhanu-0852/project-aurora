const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (userMessage, healthData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are Aurora, a warm and intelligent personal health companion.

User Health Data Today:
- Name: ${healthData.name || 'User'}
- Hydration: ${healthData.hydration || 0}ml of ${healthData.hydrationGoal || 2500}ml goal (${Math.round(((healthData.hydration || 0) / (healthData.hydrationGoal || 2500)) * 100)}% complete)
- Sleep Last Night: ${healthData.sleep || 0} hours
- Habits: ${healthData.habitsCompleted || 0} of ${healthData.totalHabits || 0} completed today
- Calories Today: ${healthData.calories || 0} kcal

Your personality:
- Warm, supportive, encouraging
- Like a knowledgeable friend, not a robot
- Keep responses SHORT (2-3 sentences max)
- Be specific using their actual data

When user logs something, include ONE action tag in your response:
<action>{"type": "log_hydration", "amount": 500}</action>
<action>{"type": "log_sleep", "duration": 7}</action>
<action>{"type": "create_habit", "name": "Meditation", "timeOfDay": "morning"}</action>
<action>{"type": "log_meal", "mealType": "breakfast", "name": "Oats", "calories": 300}</action>

Action types: log_hydration, log_sleep, create_habit, log_meal
Only include action tags when user is clearly logging something.
Never include multiple action tags.`;

    const fullPrompt = `${systemPrompt}\n\nUser says: ${userMessage}\n\nAurora:`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // Safely parse action
    let action = null;
    const actionMatch = responseText.match(/<action>([\s\S]*?)<\/action>/);
    if (actionMatch) {
      try {
        const cleanJson = actionMatch[1].trim();
        action = JSON.parse(cleanJson);
      } catch (parseError) {
        console.log('Action parse error:', parseError.message);
        action = null;
      }
    }

    // Clean response text
    const cleanResponse = responseText
      .replace(/<action>[\s\S]*?<\/action>/g, '')
      .trim();

    return {
      text: cleanResponse || "I'm here to help with your health journey! How can I assist you today?",
      action
    };

  } catch (err) {
    console.log('Gemini API error:', err.message);

    // Fallback responses based on message content
    const msg = userMessage.toLowerCase();
    let fallbackText = `I'm having trouble connecting right now, but I'm here for you, ${healthData.name}! Try again in a moment.`;

    if (msg.includes('water') || msg.includes('drink') || msg.includes('ml')) {
      fallbackText = `Great job staying hydrated, ${healthData.name}! Keep drinking water throughout the day.`;
    } else if (msg.includes('sleep') || msg.includes('slept')) {
      fallbackText = `Sleep is so important for your health! Aim for 7-8 hours consistently.`;
    } else if (msg.includes('habit') || msg.includes('meditat') || msg.includes('exercise')) {
      fallbackText = `Building habits takes consistency. You're doing great by tracking them!`;
    } else if (msg.includes('how am i') || msg.includes('doing')) {
      const hydPct = Math.round(((healthData.hydration || 0) / (healthData.hydrationGoal || 2500)) * 100);
      fallbackText = `You've had ${hydPct}% of your water goal today and completed ${healthData.habitsCompleted || 0} habits. Keep it up!`;
    }

    return { text: fallbackText, action: null };
  }
};

module.exports = { chat };