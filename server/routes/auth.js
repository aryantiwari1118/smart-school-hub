import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { validateRegistration, validatePasswordChange, validateProfileUpdate, validateSetPassword, validateAdminUserCreation } from '../middleware/validation.js';
import { verifyAuth, verifyAdmin, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// In-memory store for test mode users
const testModeUsers = [];

// Register a new user (Public - No authentication required)
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Try MongoDB first
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { mobile: mobile }
        ]
      });

      if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'mobile';
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`,
          field
        });
      }

      // Create new user
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        password,
        role,
        isActive: true
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
          mobile: newUser.mobile,
          role: newUser.role
        }
      });
    } catch (dbError) {
      // Fallback to test mode
      console.log('⚠️  MongoDB unavailable, using test mode registration');
      
      // Check if user already exists in test mode
      const existingTestUser = testModeUsers.find(u => 
        u.email === email.toLowerCase() || u.mobile === mobile
      );

      if (existingTestUser) {
        const field = existingTestUser.email === email.toLowerCase() ? 'email' : 'mobile';
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`,
          field
        });
      }

      // Create test user
      const testUser = {
        _id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile.trim(),
        password,
        role,
        isActive: true,
        createdAt: new Date()
      };

      testModeUsers.push(testUser);

      // Generate token
      const token = generateToken(testUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (Test Mode)',
        token,
        user: {
          id: testUser._id,
          name: testUser.name,
          email: testUser.email,
          mobile: testUser.mobile,
          role: testUser.role
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Get current user profile (Protected)
router.get('/profile', verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile (Protected)
router.put('/profile', verifyAuth, validateProfileUpdate, async (req, res) => {
  try {
    const { name, mobile } = req.body;

    // Check if mobile is already in use by another user
    if (mobile) {
      const existingMobile = await User.findOne({
        _id: { $ne: req.user.id },
        mobile: mobile.trim()
      });

      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already in use by another user'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile.trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password (Protected)
router.post('/change-password', verifyAuth, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordMatch = await user.matchPassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Check if email is available (Public)
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    res.status(200).json({
      success: true,
      available: !user,
      email: email.toLowerCase().trim()
    });
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email',
      error: error.message
    });
  }
});

// Check if mobile is available (Public)
router.get('/check-mobile/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;

    const user = await User.findOne({
      mobile: mobile.trim()
    });

    res.status(200).json({
      success: true,
      available: !user,
      mobile: mobile.trim()
    });
  } catch (error) {
    console.error('Mobile check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check mobile',
      error: error.message
    });
  }
});

// Get all users (Admin only)
router.get('/users', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get user by ID (Admin or self)
router.get('/users/:id', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin or requesting their own profile
    if (req.user.id !== id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// Update user (Admin only)
router.put('/users/:id', verifyAuth, verifyAdmin, validateProfileUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, role, isActive } = req.body;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if mobile is already in use by another user
    if (mobile) {
      const existingMobile = await User.findOne({
        _id: { $ne: id },
        mobile: mobile.trim()
      });

      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already in use'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile.trim();
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Deactivate user (Admin only)
router.post('/users/:id/deactivate', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
      error: error.message
    });
  }
});

// Activate user (Admin only)
router.post('/users/:id/activate', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      user
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate user',
      error: error.message
    });
  }
});

// Admin: Create new user with temporary password (Admin only)
router.post('/admin/create-user', verifyAuth, verifyAdmin, validateAdminUserCreation, async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobile: mobile }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'mobile';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`,
        field
      });
    }

    // Generate a temporary password
    const tempPassword = generateTemporaryPassword();

    // Create new user with temporary password
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: tempPassword,
      role,
      isActive: true,
      passwordSet: false
    });

    await newUser.save();

    // Create user profile
    const userProfile = new Profile({
      userId: newUser._id
    });

    await userProfile.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully. Temporary password has been set.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        temporaryPassword: tempPassword,
        passwordSet: false
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// User: Set password after first login (Protected - user only)
router.post('/set-password', verifyAuth, validateSetPassword, async (req, res) => {
  try {
    const { newPassword, tempPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify temporary password
    const isPasswordMatch = await user.matchPassword(tempPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Temporary password is incorrect'
      });
    }

    // Check if password has already been set
    if (user.passwordSet) {
      return res.status(400).json({
        success: false,
        message: 'Password has already been set. Use change-password endpoint to update it.'
      });
    }

    // Update password and mark as set
    user.password = newPassword;
    user.passwordSet = true;
    user.passwordChangedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password set successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set password',
      error: error.message
    });
  }
});

// Get user profile (Protected)
router.get('/profile-details', verifyAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate('userId', '-password');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile (Protected)
router.put('/profile-details', verifyAuth, async (req, res) => {
  try {
    const { bio, dateOfBirth, address, city, state, country, pinCode, phoneAlternate, parentName, parentPhone, qualification, specialization, experience, department } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new Profile({
        userId: req.user.id
      });
    }

    // Update profile fields
    if (bio !== undefined) profile.bio = bio;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (address !== undefined) profile.address = address;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (country !== undefined) profile.country = country;
    if (pinCode !== undefined) profile.pinCode = pinCode;
    if (phoneAlternate !== undefined) profile.phoneAlternate = phoneAlternate;
    if (parentName !== undefined) profile.parentName = parentName;
    if (parentPhone !== undefined) profile.parentPhone = parentPhone;
    if (qualification !== undefined) profile.qualification = qualification;
    if (specialization !== undefined) profile.specialization = specialization;
    if (experience !== undefined) profile.experience = experience;
    if (department !== undefined) profile.department = department;

    await profile.save();

    const updatedProfile = await Profile.findOne({ userId: req.user.id }).populate('userId', '-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get any user profile by ID (Admin or self)
router.get('/profile-details/:userId', verifyAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is admin or requesting their own profile
    if (req.user.id !== userId && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const profile = await Profile.findOne({ userId }).populate('userId', '-password');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Fetch user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Helper function to generate temporary password
const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  for (let i = 0; i < 5; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Helper function to generate JWT token
const generateToken = (user) => {
  const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';
  
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

export default router;
