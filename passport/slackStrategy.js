const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
const User = require('../models/User');
// const bcrypt = require('bcrypt');

passport.use(new SlackStrategy({
  clientID: process.env.SLACK_ID,
  clientSecret: process.env.SLACK_SECRET,
  skipUserProfile: false
}, (accessToken, refreshToken, profile, done) => {
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