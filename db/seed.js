const Post = require('../models/post');
const User = require('../models/user');

Post.deleteMany({}).then(() => {
  process.exit();
});

User.deleteMany({}).then(() => {
  process.exit();
});
