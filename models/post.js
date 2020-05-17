const mongoose = require('../db/connection');

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  post: { type: String },
  comments: [
    {
      type: String,
    },
  ],
  rating: { type: Number, default: 0 },
  time: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
