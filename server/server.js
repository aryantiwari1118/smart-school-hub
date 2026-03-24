import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-school-hub';

// Middleware
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// Use dashboard routes
import dashboardRoutes from './routes/dashboard.js';
app.use('/api/dashboard', dashboardRoutes);

// MongoDB Connection
let dbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    dbConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Initialize default test users if DB is empty
    await initializeDefaultUsers();
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, running in test mode');
    console.log('📝 Error:', error.message);
    dbConnected = false;
  }
};

// Initialize default test users in MongoDB
const initializeDefaultUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      const defaultUsers = [
        {
          name: 'Admin User',
          email: 'admin@smartedu.com',
          mobile: '9876543210',
          password: 'admin123',
          role: 'Admin'
        },
        {
          name: 'John Teacher',
          email: 'teacher@smartedu.com',
          mobile: '9876543211',
          password: 'teacher123',
          role: 'Teacher'
        },
        {
          name: 'Alex Student',
          email: 'student@smartedu.com',
          mobile: '9876543212',
          password: 'student123',
          role: 'Student'
        },
        {
          name: 'Parent User',
          email: 'parent@smartedu.com',
          mobile: '9876543213',
          password: 'parent123',
          role: 'Parent'
        }
      ];
      
      await User.insertMany(defaultUsers);
      console.log('✅ Default test users initialized in MongoDB');
    }
  } catch (error) {
    console.log('⚠️  Could not initialize default users:', error.message);
  }
};

// Hardcoded test credentials (for development/testing when MongoDB is unavailable)
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
      id: user._id || user.role + '_' + Date.now(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

// Find user by email or mobile (MongoDB)
const findUserInDB = async (emailOrMobile) => {
  try {
    if (!dbConnected) return null;
    
    const user = await User.findOne({
      $or: [
        { email: emailOrMobile.toLowerCase() },
        { mobile: emailOrMobile }
      ]
    }).select('+password');
    
    return user;
  } catch (error) {
    console.error('DB query error:', error.message);
    return null;
  }
};

// Find user by email or mobile (Fallback to hardcoded)
const findUserByEmailOrMobile = (emailOrMobile) => {
  for (const [key, user] of Object.entries(VALID_CREDENTIALS)) {
    if (user.email === emailOrMobile || user.mobile === emailOrMobile) {
      return user;
    }
  }
  return null;
};

// Legacy Login endpoint (for backward compatibility)
app.post('/api/login', async (req, res) => {
  try {
    const { emailOrMobile, password, role } = req.body;

    // Validation
    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Mobile and password are required'
      });
    }

    let user = null;

    // Try MongoDB first
    if (dbConnected) {
      user = await findUserInDB(emailOrMobile);
      if (user) {
        // Verify password
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Check role if provided
        if (role && role !== user.role) {
          return res.status(401).json({
            success: false,
            message: `This account is for ${user.role}, not ${role}`
          });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();
      }
    }

    // Fallback to hardcoded test credentials
    if (!user) {
      user = findUserByEmailOrMobile(emailOrMobile);

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

      // Check role if provided
      if (role && role !== user.role) {
        return res.status(401).json({
          success: false,
          message: `This account is for ${user.role}, not ${role}`
        });
      }
    }

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.role + '_' + Date.now(),
        name: user.name,
        email: user.email,
        role: user.role,
        passwordSet: user.passwordSet !== undefined ? user.passwordSet : true // Default to true for test users
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

// Verify token endpoint
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
    message: 'Backend is running',
    database: dbConnected ? 'MongoDB connected' : 'MongoDB not connected (test mode)'
  });
});

// Get test credentials endpoint (for development only - KEPT AS IS FOR TESTING)
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

// Legacy Register endpoint (for backward compatibility)
// Note: Full registration functionality is in /api/auth/register
app.post('/api/register', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Registration is disabled.'
      });
    }

    const { name, email, mobile, password, role } = req.body;

    // Validation
    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or mobile already exists'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      role
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
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

// Connect to MongoDB and start server
(async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`\n📊 Database Status: ${dbConnected ? '✅ MongoDB Connected' : '⚠️  Test Mode (Hardcoded Credentials)'}`);
    console.log(`
  ✅ Test Credentials (Always Available):
  =====================================
  Admin   | Email: admin@smartedu.com   | Mobile: 9876543210 | Password: admin123
  Teacher | Email: teacher@smartedu.com | Mobile: 9876543211 | Password: teacher123
  Student | Email: student@smartedu.com | Mobile: 9876543212 | Password: student123
  Parent  | Email: parent@smartedu.com  | Mobile: 9876543213 | Password: parent123
  
  📡 Authentication Endpoints (Legacy - /api/):
  ==============================================
  POST   /api/login              - Login with email/mobile and password
  POST   /api/register           - Register new user
  POST   /api/verify-token       - Verify JWT token
  GET    /api/health             - Server health check
  GET    /api/test-credentials   - Test credentials (dev only)

  📡 New Registration & User Management Endpoints (/api/auth/):
  ============================================================
  POST   /api/auth/register              - Register new user
  GET    /api/auth/profile               - Get current user profile (protected)
  PUT    /api/auth/profile               - Update user profile (protected)
  POST   /api/auth/change-password       - Change password (protected)
  GET    /api/auth/check-email/:email    - Check if email is available
  GET    /api/auth/check-mobile/:mobile  - Check if mobile is available
  GET    /api/auth/users                 - Get all users (admin only)
  GET    /api/auth/users/:id             - Get user by ID (admin or self)
  PUT    /api/auth/users/:id             - Update user (admin only)
  DELETE /api/auth/users/:id             - Delete user (admin only)
  POST   /api/auth/users/:id/activate    - Activate user (admin only)
  POST   /api/auth/users/:id/deactivate  - Deactivate user (admin only)

  🔐 Authentication:
  ==================
  Send token in header: Authorization: Bearer <token>
  Or: X-Auth-Token: <token>

  📖 Full Documentation:
  ======================
  See server/MONGODB_SETUP.md and server/QUICK_REFERENCE.md
  `);
  });
})();
