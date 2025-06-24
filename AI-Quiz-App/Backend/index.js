// backend/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // ensure node-fetch@2 is installed

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz backend is running' });
});

// Generate quiz questions using Gemini API
app.post('/api/generate-questions', async (req, res) => {
  const { topic, numQuestions } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not set in .env' });
  }

  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  if (!numQuestions || typeof numQuestions !== 'number' || numQuestions < 1 || numQuestions > 20) {
    return res.status(400).json({ error: 'Number of questions must be between 1 and 20' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate ${numQuestions} multiple choice questions about ${topic}. 

Return ONLY a valid JSON array in this format:
[
  {
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correct": 0
  }
]

- Each question must have 4 options
- "correct" must be the index (0-3)
- No explanation or text outside JSON`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return res.status(500).json({ error: 'Failed to generate questions from Gemini' });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Gemini response did not contain valid JSON' });
    }

    let questions;
    try {
      questions = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse generated JSON' });
    }

    // Basic validation
    const validQuestions = questions.filter(q =>
      q.question &&
      Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correct === 'number' && q.correct >= 0 && q.correct < 4
    );

    res.json({ success: true, questions: validQuestions });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Quiz backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
