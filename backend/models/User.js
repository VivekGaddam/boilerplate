const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
