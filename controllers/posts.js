const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.get('/', (req, res) => {
  Post.find({}).then((posts) => res.json(posts));
});

router.get('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => res.json(post));
});

router.post('/', (req, res) => {
  Post.create(req.body).then((post) => res.json(post));
});

router.put('/update/:id', (req, res) => {
  Post.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: { comments: req.body } },
    { new: true }
  ).then((post) => res.json(post));
});

router.delete('/delete/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then((post) => res.json(post));
});

module.exports = router;
