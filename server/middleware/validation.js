// Validation middleware for registration
export const validateRegistration = (req, res, next) => {
  const { name, email, mobile, password, role } = req.body;

  const errors = [];

  // Validate name
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate mobile
  if (!mobile || mobile.trim().length === 0) {
    errors.push('Mobile number is required');
  } else if (!/^[0-9]{10,15}$/.test(mobile.replace(/[\s-]/g, ''))) {
    errors.push('Mobile number must be 10-15 digits');
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 100) {
    errors.push('Password must not exceed 100 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    // Optional: enforce stronger password (uppercase, lowercase, number)
    console.log('Weak password: Consider enforcing uppercase, lowercase, and numbers');
  }

  // Validate role
  const validRoles = ['Admin', 'Teacher', 'Student', 'Parent'];
  if (!role) {
    errors.push('Role is required');
  } else if (!validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for login
export const validateLogin = (req, res, next) => {
  const { emailOrMobile, password, role } = req.body;

  const errors = [];

  if (!emailOrMobile || emailOrMobile.trim().length === 0) {
    errors.push('Email or Mobile is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (role) {
    const validRoles = ['Admin', 'Teacher', 'Student', 'Parent'];
    if (!validRoles.includes(role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for profile update
export const validateProfileUpdate = (req, res, next) => {
  const { name, mobile } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (name.trim().length === 0) {
      errors.push('Name cannot be empty');
    } else if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (name.trim().length > 100) {
      errors.push('Name must not exceed 100 characters');
    }
  }

  if (mobile !== undefined) {
    if (mobile.trim().length === 0) {
      errors.push('Mobile cannot be empty');
    } else if (!/^[0-9]{10,15}$/.test(mobile.replace(/[\s-]/g, ''))) {
      errors.push('Mobile number must be 10-15 digits');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for password change
export const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push('Current password is required');
  }

  if (!newPassword) {
    errors.push('New password is required');
  } else if (newPassword.length < 6) {
    errors.push('New password must be at least 6 characters long');
  } else if (newPassword.length > 100) {
    errors.push('New password must not exceed 100 characters');
  }

  if (currentPassword === newPassword) {
    errors.push('New password must be different from current password');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for setting password (first time)
export const validateSetPassword = (req, res, next) => {
  const { newPassword, tempPassword } = req.body;
  const errors = [];

  if (!tempPassword) {
    errors.push('Temporary password is required');
  }

  if (!newPassword) {
    errors.push('New password is required');
  } else if (newPassword.length < 6) {
    errors.push('New password must be at least 6 characters long');
  } else if (newPassword.length > 100) {
    errors.push('New password must not exceed 100 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    errors.push('Password must contain uppercase, lowercase, and numbers');
  }

  if (tempPassword === newPassword) {
    errors.push('New password must be different from temporary password');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for admin user creation
export const validateAdminUserCreation = (req, res, next) => {
  const { name, email, mobile, role } = req.body;
  const errors = [];

  // Validate name
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Validate mobile
  if (!mobile || mobile.trim().length === 0) {
    errors.push('Mobile number is required');
  } else if (!/^[0-9]{10,15}$/.test(mobile.replace(/[\s-]/g, ''))) {
    errors.push('Mobile number must be 10-15 digits');
  }

  // Validate role
  const validRoles = ['Admin', 'Teacher', 'Student', 'Parent'];
  if (!role) {
    errors.push('Role is required');
  } else if (!validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
