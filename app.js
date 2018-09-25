const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

//get the css files
app.use(express.static('public'));

//db config
const sequelize = new Sequelize({
  database: 'bulletinboard',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  dialect: 'postgres',
  define: {
    timestamps: false, // true by default
  },
});

//defining the model
const Message = sequelize.define('messages', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
});

app.get('/', (req, res) => {
  res.render('add_msg');
});

app.get('/all-messages', (req, res) => {
  Message.findAll().then(messages => {
    res.render('all_msgs', { posts: messages });
  });
});

app.post('/all-messages', (req, res) => {
  const title = req.body.title;
  const msg = req.body.message;
  Message.create({ title: title, body: msg }).then(() => {
    res.redirect('/all-messages');
  });
});

app.listen(3000, function(err) {
  if (err) {
    return err;
  }
  console.log('app listening on port 3000!');
});
