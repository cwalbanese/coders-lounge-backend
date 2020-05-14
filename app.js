const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const postsController = require('./controllers/posts');
const usersController = require('./controllers/users');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/posts', postsController);
app.use('/api/users', usersController);

app.set('port', process.env.PORT || 8082);

app.listen(app.get('port'), () => {
  console.log(`✅ PORT: ${app.get('port')} 🌟`);
});
