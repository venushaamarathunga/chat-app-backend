const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log('MongoDB connection succeeded.');
  } else {
    console.log(
      'Error in MongoDB connection: ' + JSON.stringify(err, undefined, 2)
    );
  }
});
// Map globle promises
mongoose.Promise = global.Promise;
require('./user.model');
