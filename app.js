const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

//get the css files
app.use(express.static('public'));

//db config
const client = new Client({
  database: 'bulletinboard',
  host: 'localhost',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

client.connect();

app.get('/', (req, res) => {
  res.render('add_msg');
});

app.get('/all-messages', (req, res) => {
  client.query('select * from messages', (err, qRes) => {
    if (err) {
      console.log(err);
      return err.stack;
    }
    res.render('all_msgs', { posts: qRes.rows });
  });
});

app.post('/all-messages', (req, res) => {
  console.log('post');
  const title = req.body.title;
  const msg = req.body.message;
  client.query(
    `insert into messages(title, body) values('${title}', '${msg}')`,
    err => {
      if (err) {
        console.log(err);
        return err.stack;
      }
      console.log('message added to the database');

      client.query('select * from messages', (err, qRes) => {
        if (err) {
          console.log(err);
          return err.stack;
        }
        //client.end();
        res.render('all_msgs', { posts: qRes.rows });
      });
    }
  );
});

app.listen(3000, function(err) {
  if (err) {
    return err;
  }
  console.log('app listening on port 3000!');
});
