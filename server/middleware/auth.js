const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Please login.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};

module.exports = authMiddleware;
