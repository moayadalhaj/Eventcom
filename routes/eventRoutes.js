const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const moment = require('moment');
moment().format();
const { check, validationResult } = require('express-validator');

// middlware to check if user is logged in

isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/users/login');
}

// route to home events
// router.get('/', (req, res) => {
//   Event.find({}, (err, events) => {
//     res.render('index', { events, message: req.flash('info') });
//   })
// })

// for pagination
router.get('/:pageNo?', (req, res) => {
  let pageNo = req.params.pageNo;

  // find total documents
  let totalDocuments = 0;
  Event.countDocuments({}, (err, total) => {
    totalDocuments = parseInt(total);
    if (req.params.pageNo == 0 || ((totalDocuments - (totalDocuments % 5)) / 5) + 1 < parseInt(pageNo)) {
      pageNo = 1;
    }

    let q = {
      skip: 5 * (pageNo - 1),
      limit: 5
    }

    // Event.find({}, {}, q, (err, events) => {
    //   res.render('index', {
    //     events,
    //     message: req.flash('info'),
    //     total: parseInt(totalDocuments),
    //     pageNo
    //   });
    // })
    Event.find({}, {}, q)
      .sort({ _id: -1 })
      .exec((err, events) => {
        res.render('index', {
          events,
          message: req.flash('info'),
          total: parseInt(totalDocuments),
          pageNo
        });
      })
  })
})

// route to single event
router.get('/show/:id', (req, res) => {
  Event.findOne({ _id: req.params.id }, (err, event) => {
    if (!err) {
      res.render('show', { event });
    } else {
      console.log(err);
    }
  })
})

// route to navigate to addEvent page
router.get('/create/createEvent', isAuthenticated, (req, res) => {
  res.render('create', { errors: req.flash('errors') })
})

// route to create new event
router.post('/create/createEvent', [
  check('title').isLength({ min: 5 }).withMessage('Title should be more than 5 char'),
  check('description').isLength({ min: 5 }).withMessage('Description should be more than 5 char'),
  check('location').isLength({ min: 3 }).withMessage('Location should be more than 5 char'),
  check('date').isLength({ min: 5 }).withMessage('Date should valid date'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    res.redirect('/events/create/createEvent')
  } else {

    let data = { ...req.body, userId: req.user.id };
    let newEvent = new Event(data);
    newEvent.save(err => {
      if (!err) {
        console.log("Event was added");
        req.flash('info', 'The Event was created successfuly')
        res.redirect('/events');
      } else {
        console.log(err);
      }
    });
  }

})

// route to edit an event

router.get('/edit/:id', isAuthenticated, (req, res) => {
  Event.findOne({ _id: req.params.id }, (err, event) => {
    if (!err) {
      res.render('edit', {
        event,
        eventDate: moment(event.date).format('YYYY-MM-DD'),
        errors: req.flash('errors'),
        message: req.flash('info')
      });
    } else {
      console.log(err);
    }
  })
})

// route to update an event

router.post('/event/update', isAuthenticated, [
  check('title').isLength({ min: 5 }).withMessage('Title should be more than 5 char'),
  check('description').isLength({ min: 5 }).withMessage('Description should be more than 5 char'),
  check('location').isLength({ min: 3 }).withMessage('Location should be more than 5 char'),
  check('date').isLength({ min: 5 }).withMessage('Date should valid date'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    res.redirect('/events/edit/' + req.body.id)
  } else {
    Event.findByIdAndUpdate({ _id: req.body.id }, req.body, err => {
      if (!err) {
        req.flash('info', 'The event was updated successfuly')
        res.redirect('/events/edit/' + req.body.id)
      } else {
        console.log(err)
      }
    })
  }
})

// route to delete an event

router.delete('/delete/:id', isAuthenticated, (req, res) => {
  Event.findByIdAndDelete({ _id: req.params.id }, err => {
    if (!err) {
      res.status(200).json('Event was deleted');
    } else {
      res.status(404).json('There was an error event was not deleted')
    }
  })
})
module.exports = router;