const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectToDB();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' }, // employee, hr, admin
  joinDate: { type: Date, default: Date.now },
  totalLeaves: { type: Number, default: 12 }
});

const User = mongoose.model('User', userSchema);

// Leave Schema (updated to reference user)
const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  leaveType: String,
  startDate: String,
  endDate: String,
  reason: String,
  status: { type: String, default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});
const Leave = mongoose.model("Leave", leaveSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Gemini API call
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini SDK error:", error);
    throw new Error("Failed to generate content from Gemini");
  }
}

// Get user leave balance
const getUserLeaveBalance = async (userId) => {
  const user = await User.findById(userId);
  const usedLeaves = await Leave.countDocuments({ 
    userId: userId, 
    status: "Approved" 
  });
  return user.totalLeaves - usedLeaves;
};

// AUTH ROUTES

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// PROTECTED ROUTES

// Chat endpoint (protected)
app.post("/api/chat", authenticateToken, async (req, res) => {
  const userMessage = req.body.message;
  const userId = req.user.userId;

  try {
    // Get user details and leave balance
    const user = await User.findById(userId);
    const leaveBalance = await getUserLeaveBalance(userId);

    const systemPrompt = `
You are a strict HR assistant for ${user.name}. You MUST follow these rules:

IMPORTANT: You can ONLY respond to HR-related topics. If the user asks about anything that is NOT related to HR, you must politely redirect them.

HR TOPICS YOU CAN HELP WITH:
- Leave applications and leave balance
- Leave policies and leave types
- Employee benefits and policies
- Work schedules and attendance
- Employee grievances and complaints
- Performance reviews and feedback
- Company policies and procedures
- Payroll and salary inquiries
- Training and development programs
- Employee onboarding and offboarding
- Workplace harassment or safety concerns
- Holiday and vacation policies

EMPLOYEE INFORMATION:
- This employee has ${user.totalLeaves} total casual leaves per year
- They currently have ${leaveBalance} leaves remaining
- Leave requests are stored in the system

STRICT RULE: If the user asks about topics like:
- General knowledge questions
- Technology, programming, or coding
- Personal advice not related to work
- Current events or news
- Entertainment, sports, or hobbies
- Academic subjects
- Medical advice
- Any non-HR related topics

You MUST respond with: "I'm an HR assistant and can only help with HR-related questions. Please ask me about leaves, company policies, benefits, or other workplace matters."

User message: "${userMessage}"

Analyze the message first - if it's not HR-related, redirect. If it is HR-related, provide helpful information.
`;

    const reply = await getGeminiResponse(systemPrompt);

    // Handle leave application
    if (userMessage.toLowerCase().includes("apply for leave") || 
        userMessage.toLowerCase().includes("request leave")) {
      
      // You can enhance this to extract actual dates and reasons from the message
      const leaveData = new Leave({
        userId: userId,
        name: user.name,
        leaveType: "Casual",
        startDate: new Date().toISOString().split('T')[0], // Today as default
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        reason: "Leave request via chatbot",
      });
      await leaveData.save();
    }

    res.json({ reply });

  } catch (err) {
    console.error("Chat API Error:", err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const leaveBalance = await getUserLeaveBalance(req.user.userId);
    
    res.json({
      user,
      leaveBalance,
      totalLeaves: user.totalLeaves
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's leaves
app.get('/api/leaves', authenticateToken, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.userId }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply for leave (detailed endpoint)
app.post('/api/leaves', authenticateToken, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const user = await User.findById(req.user.userId);

    const leaveData = new Leave({
      userId: req.user.userId,
      name: user.name,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leaveData.save();
    res.status(201).json({ message: 'Leave application submitted', leave: leaveData });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));