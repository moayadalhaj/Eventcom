const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// saving user object in the session

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
});

passport.use('local.signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  if (req.body.password != req.body.confirmPassword) {
    return done(null, false, req.flash('error', 'Passwords do not match'))
  } else {
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('error', 'Email already used'))
      }
      if (!user) {
        let newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.hashPassword(req.body.password);
        newUser.avatar = "avatar.png"
        newUser.save((err, user) => {
          if (!err) {
            return done(null, user, req.flash('success', 'User Added'))
          } else {
            console.log(err)
          }
        })
      }
    })
  }
}))

// login strategy

passport.use('local.login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      return done(null, false, req.flash('error', 'Somthing wrong happened'))
    }
    if (!user) {
      return done(null, false, req.flash('error', 'User was not found. Please, signup first'))
    }
    if (user) {
      if (user.comparePassword(password, user.password)) {
        return done(null, user, req.flash('success', 'Welcome back'))
      } else {
        return done(null, false, req.flash('error', 'Password is wrong'))
      }
    }
  })
}))