const express = require('express');
const User = require('../models/user');
const router = express.Router();
const UserSession = require('../models/usersession');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  User.find({}).then((users) => res.json(users));
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => res.json(user));
});

router.get('/verify', (req, res, next) => {
  const { query } = req;
  const { token } = query;

  UserSession.find(
    {
      _id: token,
      isDeleted: false,
    },
    (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error',
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid',
        });
      } else {
        return res.send({
          success: true,
          message: 'Good',
        });
      }
    }
  );
});

router.post('/login', (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { username } = body;
  if (!username) {
    return res.send({
      success: false,
      message: 'Error: Username cannot be blank.',
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.',
    });
  }
  username = username.toLowerCase();
  username = username.trim();
  User.find(
    {
      username: username,
    },
    (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error',
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid',
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid',
        });
      }

      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: server error',
          });
        }
        return res.send({
          success: true,
          message: '',
          token: doc._id,
        });
      });
    }
  );
});

router.get('/logout', (req, res, next) => {
  const { query } = req;
  const { token } = query;
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    null,
    () => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'error: server error',
        });
      }
      return res.send({
        success: true,
        message: 'good',
      });
    }
  );
});

router.post('/signup', (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { username } = body;

  if (!username) {
    return res.send({
      success: false,
      message: 'error: username cannot be blank.',
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'error: password cannot be blank.',
    });
  }
  username = username.toLowerCase();
  username = username.trim();

  User.find(
    {
      username: username,
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'error: server error',
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'error: account already exists.',
        });
      }

      const newUser = new User();
      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      newUser._id = mongoose.Types.ObjectId();
      newUser.save((err, user) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'error: server error',
          });
        }
        return res.send({
          success: true,
          message: 'signed up',
        });
      });
    }
  );
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
