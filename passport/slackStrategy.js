const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
const User = require('../models/User');
// const bcrypt = require('bcrypt');

passport.use(new SlackStrategy({
  clientID: '508255248276.510757630310',
  clientSecret: "0f7fd8596de9a11b52d44b9cf8a92c70",
  skipUserProfile: false
}, (accessToken, refreshToken, profile, done) => {
  // done(null, profile)
  // console.log("profile", profile)
  User.findOne({ slackID: profile.user.id })
  .then(user => {
    // if (error) {
    //   return done(error);
    // }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      slackID: profile.user.id,
      username: profile.user.name

    });

    newUser.save()
    .then(user => {
      done(null, newUser);
    })
  })
  .catch(error => {
    done(error)
  })

}));