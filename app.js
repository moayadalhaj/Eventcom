const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const eventRouter = require('./routes/eventRoutes');
const userRouter = require('./routes/userRoutes')
const passport = require('passport');
const passportSetup = require('./config/Passport-setup');
require('dotenv').config();
const databaseURL = process.env.DATABASE_URL;

mongoose.connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('uploads'))

app.set('views', path.join(__dirname, '/views/event'))
app.set('view engine', 'ejs');

// session and flash config
app.use(session({
  secret: 'Moayad',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 15 }
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// store user object
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

app.get('/', (req, res) => {
  res.redirect('/events')
})

app.use('/events', eventRouter);
app.use('/users', userRouter);

app.listen(3000, () => {
  console.log(`App is working on port 3000`)
})