const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser
} = require('../controllers/authController');

// Register
router.post('/register', registerUser);

// Email Verification
router.get('/verify-email/:token', verifyEmail);

// Login
router.post('/login', loginUser);

// Logout
router.get('/logout', logoutUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); 
  }
);

module.exports = router;
