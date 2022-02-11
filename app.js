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
})

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

  const clicksCollection = app.locals.db.collection('clicks');    

  clicksCollection.insertOne({ timestamp: timestamp}).then(result => {
    console.log(result);
    res.sendStatus(201);
  }).catch(error => console.error(error));
});

app.get('/clicks', (req, res) => {
  const clicksCollection = app.locals.db.collection('clicks');
  clicksCollection.countDocuments().then(result => {
    console.log(result);
    res.send({ count: result});
  }).catch(error => {
    return console.error(error);
  });
});

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
