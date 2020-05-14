const Post = require('../models/post');
const seedData = require('./seeds.json');

Post.deleteMany({})

  .then(() => Post.collection.insertMany(seedData))

  .then(() => {
    process.exit();
  });
