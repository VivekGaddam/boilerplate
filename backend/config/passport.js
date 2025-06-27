// passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value, // Assuming email is always present
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
