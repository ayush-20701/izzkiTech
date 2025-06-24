// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz API is running' });
});

// Generate questions endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;

    // Validate input
    if (!topic || !topic.trim()) {
      return res.status(400).json({ 
        error: 'Topic is required' 
      });
    }

    if (!numQuestions || numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({ 
        error: 'Number of questions must be between 1 and 20' 
      });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured' 
      });
    }

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate ${numQuestions} multiple choice questions about ${topic}. 
                  
                  Return ONLY a valid JSON array with this exact format:
                  [
                    {
                      "question": "Question text here?",
                      "options": ["Option A", "Option B", "Option C", "Option D"],
                      "correct": 0
                    }
                  ]
                  
                  Rules:
                  - Each question must have exactly 4 options
                  - The "correct" field should be the index (0-3) of the correct answer
                  - Make questions challenging but fair
                  - Ensure questions are diverse within the topic
                  - Do not include any explanation or additional text
                  - Return only the JSON array
                  - Questions should be educational and appropriate`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return res.status(500).json({ 
        error: `Failed to generate questions: ${response.status}` 
      });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return res.status(500).json({ 
        error: 'Invalid response from Gemini API' 
      });
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', generatedText);
      return res.status(500).json({ 
        error: 'Invalid response format from AI' 
      });
    }

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse generated questions' 
      });
    }
    
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      return res.status(500).json({ 
        error: 'No valid questions generated' 
      });
    }

    // Validate question format
    const validQuestions = generatedQuestions.filter(q => 
      q.question && 
      typeof q.question === 'string' &&
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      q.options.every(opt => typeof opt === 'string') &&
      typeof q.correct === 'number' && 
      q.correct >= 0 && 
      q.correct < 4
    );

    if (validQuestions.length === 0) {
      return res.status(500).json({ 
        error: 'Generated questions have invalid format' 
      });
    }

    // Return the requested number of questions
    const finalQuestions = validQuestions.slice(0, numQuestions);
    
    res.json({
      success: true,
      questions: finalQuestions,
      topic: topic,
      generated: finalQuestions.length
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Quiz API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
  } else {
    console.log('✅ Gemini API key configured');
  }
});

module.exports = app;