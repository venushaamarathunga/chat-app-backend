const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res, next) => {

  const user = new User();
  user.email = req.body.email;
  user.password = User.hashPassword(req.body.password);
  user.userName = req.body.userName;
  user.contactNum = req.body.contactNum;
  user.creation_dt = Date.now();
  user.save((err, doc) => {
    if (!err) {
      res.status(201).send(doc);
    } else {
      if (err.code == 11000) {
        res.status(422).send('duplicate email address found.');
      } else {
        return next(err);
      }
    }
  });
});

router.post('/login', (req, res, next) => {
  let promise = User.findOne({ email: req.body.email }).exec();

  promise.then((doc) => {
    if (doc) {      
      if (doc.isValid(req.body.password)) {
        // genarate token
        let token = jwt.sign({ userName: doc.userName }, 'secretkey', {
          expiresIn: '1h',
        });
        return res.status(200).json(token);
      } else {
        return res.status(501).json({ message: 'Invalid credentials.' });
      }
    } else {
      return res.status(501).json({ message: 'User email is not registerd.' });
    }
  });
  promise.catch((err) => {
    return res.status(501).json({ message: 'Internal error.' });
  });
});

router.get('/userProfile', verifyToken, (req, res, next) => {
  // return res.status(200).json()

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json(authData.userName);
    }
  });
});

// verify token
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers['authorization'];
  // check if bearer is undefined
  if (typeof bearerHeader != 'undefined') {
    // split at the space
    const bearer = bearerHeader.split(' ');
    // get token from array
    const bearerToken = bearer[1];
    // set the Token
    req.token = bearerToken;
    //next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = router;
