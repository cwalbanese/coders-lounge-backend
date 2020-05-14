const express = require('express');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

router.get('/', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      User.find({}).then((users) => res.json(users));
    }
  });
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => res.json(user));
});

router.post('/', (req, res) => {
  User.create(req.body).then((user) => {
    res.json(user);
  });
});

router.post('/login', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };
  jwt.sign({ user: user }, 'secretkey', (err, token) => {
    res.json({
      token: token,
    });
  });
});

router.put('/update/:id', (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: req.body },
    { new: true }
  ).then((user) => res.json(user));
});

router.delete('/delete/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id }).then((user) => res.json(user));
});

module.exports = router;
