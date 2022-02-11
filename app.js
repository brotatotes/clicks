var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('clicks.db', (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to SQlite database.');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/index', indexRouter);

app.post('/clicked', (req, res) => {
  const timestamp = (new Date()).toISOString();
  console.log(timestamp);
  console.log(db);

  db.run("INSERT INTO clicks(Timestamp) VALUES (?)", [timestamp], err => {
    if (err) {
      return console.log(err.message);
    }

    console.log(`An entry has been inserted with Timestamp ${timestamp}`)
  });

  res.sendStatus(201);
})

app.get('/clicks', (req, res) => {
  let sql = "SELECT COUNT(*) AS count FROM clicks";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.log(err.message);
    }

    res.send(rows);
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
