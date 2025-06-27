const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
