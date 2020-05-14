const mongoose = require('../db/connection');

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  post: { type: String, required: true },
  comments: [
    {
      text: String,
      userId: String,
    },
  ],
  rating: { type: Number, default: 0 },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
