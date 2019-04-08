// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var kafka = require('./kafka-events');
kafka.init();

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
  res.locals.ua = req.get('user-agent');  // put user agent info into the response data for client side logic
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(function(req, res, next) {
  kafka.sender.sendServicePayload('error','404 error', function(err, data){console.log(err);});
  next(createError(404)); // catch 404 and forward to error handler
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
