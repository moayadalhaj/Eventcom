const mongoose = require('mongoose');
const Event = require('../models/Event');
mongoose.connect('mongodb+srv://moayadalhaj:13579@cluster0.s1tmf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const newEvent = new Event({
  title: 'First Event',
  description: 'Amazing and unique one in this reagion',
  location: 'Amman',
  date: Date.now(),
})

newEvent.save((err) => {
  if (!err) {
    console.log('Record was added')
  } else {
    console.log(err)
  }
});