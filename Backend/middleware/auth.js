const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token and extract user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database excluding the password field, attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

module.exports = { protect };