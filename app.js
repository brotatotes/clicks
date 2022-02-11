const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

// connect to database
MongoClient.connect(process.env.MONGODB_CONNECTION_STRING).then(client => {
  console.log('Connected to MongoDB database!');

  app.locals.db = client.db('clicks');
  app.locals.collection = app.locals.db.collection('clicks');
  setCount();
  const changeStream = app.locals.db.watch();
  changeStream.on("change", next => {
    setCount();
  });
});

async function setCount() {
  app.locals.count = await app.locals.collection.countDocuments();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.post('/clicked', (req, res) => {
  const timestamp = (new Date()).toISOString();
  console.log(timestamp);

  app.locals.collection.insertOne({ timestamp: timestamp }).then(result => {
    console.log(result);
    res.sendStatus(201);
  }).catch(error => console.error(error));
}); 

app.get('/clicks', (req, res) => {
  res.send({ count: app.locals.count })
});

app.get('/pollingInterval', (req, res) => {
  console.log(process.env.POLLING_INTERVAL);
  res.send({ pollingInterval: parseInt(process.env.POLLING_INTERVAL) });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
