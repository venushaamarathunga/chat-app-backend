// config mongoose and server post
require('./config/config');
// mongoose middleware
require('./models/db');

const express = require('express');
const bodyParser = require('body-parser');
let cors = require('cors');

// loda route controller
const userController = require('./controller/user.controller');

const app = express();
// body-parser middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

// use route controller
app.use('/user', userController);

const port = 3000 || process.env.PORT; 

// error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    let valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

// server start
app.listen(port, () => {
  console.log(`Server start on port : ${port}`);
});
