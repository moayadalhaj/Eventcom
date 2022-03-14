const express = require('express');
const passport = require('passport');
const router = express.Router();

const multer = require('multer');
const User = require('../models/User');
// configure for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png');
  }
})

const upload = multer({ storage: storage })
// middlware to check if user is logged in

isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/users/login');
}

// login user view
router.get('/login', (req, res) => {
  res.render('user/login', {
    error: req.flash('error')
  });
})

// login post request
router.post('/login',
  passport.authenticate('local.login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })
)

// sign up form
router.get('/signup', (req, res) => {
  res.render('user/signup', {
    error: req.flash('error')
  });
})

// sign up post request
router.post('/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true
  })
)

// profile view
router.get('/profile', isAuthenticated, (req, res) => {
  res.render('user/profile', {
    success: req.flash('success')
  })
})

// upload user avatar
router.post('/uploadAvatar', upload.single('avatar'), (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: req.file.filename }, err => {
    if (!err) {
      res.redirect('/users/profile');
    }
  })
})

// logout user
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
})

module.exports = router