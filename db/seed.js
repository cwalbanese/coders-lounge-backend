const Post = require('../models/post');
const User = require('../models/user');
const seedData = require('./seeds.json');

Post.deleteMany({})

  .then(() => Post.collection.insertMany(seedData))

  .then(() => {
    process.exit();
  });

User.deleteMany({}).then(() => {
  process.exit();
});
