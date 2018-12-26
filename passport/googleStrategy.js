var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    // passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile: ",profile)
    User.findOne({ googleID: profile.id })
    .then(user => {
      // if (error) {
      //   return done(error);
      // }
      if (user) {
        return done(null, user);
      }
  
      const newUser = new User({
        googleID: profile.id,
        username: profile.emails[0].value
  
      });
  
      newUser.save()
      .then(user => {
        done(null, newUser);
      })
    })
    .catch(error => {
      done(error)
    })
  
  }
));