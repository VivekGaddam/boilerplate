const passport = require('passport');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }

    const user = new User({ username, email });
    await User.register(user, password);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking on this link: <a href="${verificationUrl}">${verificationUrl}</a>`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message,
      });
      res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
      await User.findByIdAndDelete(user._id); 
      return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      if (!user.isVerified) {
        req.logout(() => {}); 
        return res.status(401).json({ message: 'Please verify your email before logging in.' });
      }
      res.json({ message: 'Logged in successfully', user: req.user });
    });
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; 
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during email verification.' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this because you (or someone else) has requested the reset of a password. Please click on this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>. This link will expire in 1 hour.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });
      res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).json({ message: 'Error sending password reset email. Please try again.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during forgot password request.' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    await user.setPassword(req.body.password); // Set new password using passport-local-mongoose method
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.isVerified = true; // Mark as verified if they reset password
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during password reset.' });
  }
};
