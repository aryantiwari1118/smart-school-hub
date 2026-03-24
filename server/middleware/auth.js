import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
export const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Middleware to check if user is admin
export const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

// Middleware to check user role
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};
