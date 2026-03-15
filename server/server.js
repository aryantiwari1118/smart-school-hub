import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Hardcoded credentials for different roles
const VALID_CREDENTIALS = {
  admin: {
    email: 'admin@smartedu.com',
    mobile: '9876543210',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin'
  },
  teacher: {
    email: 'teacher@smartedu.com',
    mobile: '9876543211',
    password: 'teacher123',
    name: 'John Teacher',
    role: 'Teacher'
  },
  student: {
    email: 'student@smartedu.com',
    mobile: '9876543212',
    password: 'student123',
    name: 'Alex Student',
    role: 'Student'
  },
  parent: {
    email: 'parent@smartedu.com',
    mobile: '9876543213',
    password: 'parent123',
    name: 'Parent User',
    role: 'Parent'
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.role + '_' + Date.now(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

// Find user by email or mobile
const findUserByEmailOrMobile = (emailOrMobile) => {
  for (const [key, user] of Object.entries(VALID_CREDENTIALS)) {
    if (user.email === emailOrMobile || user.mobile === emailOrMobile) {
      return user;
    }
  }
  return null;
};

// Login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { emailOrMobile, password, role } = req.body;

    // Validation
    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Mobile and password are required'
      });
    }

    // Find user by email or mobile
    const user = findUserByEmailOrMobile(emailOrMobile);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Optional: Check if the selected role matches the user's role
    if (role && role !== user.role) {
      return res.status(401).json({
        success: false,
        message: `This account is for ${user.role}, not ${role}`
      });
    }

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.role + '_' + Date.now(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Verify token endpoint (optional)
app.post('/api/verify-token', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running'
  });
});

// Get test credentials (for development only)
app.get('/api/test-credentials', (req, res) => {
  const credentials = {};
  for (const [key, user] of Object.entries(VALID_CREDENTIALS)) {
    credentials[user.role] = {
      email: user.email,
      mobile: user.mobile,
      password: user.password
    };
  }
  res.status(200).json({
    success: true,
    message: 'Test credentials (for development only)',
    credentials
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`
  Test Credentials:
  ================
  Admin   | Email: admin@smartedu.com   | Password: admin123
  Teacher | Email: teacher@smartedu.com | Password: teacher123
  Student | Email: student@smartedu.com | Password: student123
  Parent  | Email: parent@smartedu.com  | Password: parent123
  `);
});
