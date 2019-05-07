// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var cors = require('cors')
var debug = require('debug')('app')

const SERVICE_NAME = process.env.SERVICE_NAME || 'app-ui'
const BOARDS_SVC_HOST = process.env.BOARDS_SVC_HOST || 'boards'
const BOARDS_SVC_PORT = process.env.BOARDS_SVC_PORT || '8080'
const PROFILE_SVC_HOST = process.env.PROFILE_SVC_HOST || 'profile'
const PROFILE_SVC_PORT = process.env.PROFILE_SVC_PORT || '8080'
const SSO_SVC_HOST = process.env.SSO_SVC_HOST || 'auth-sso73-x509'
const SSO_SVC_PORT = process.env.SSO_SVC_PORT || '8443'

var app = express()
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine',  'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req,res,next) {
  req.SERVICE_NAME = SERVICE_NAME
  req.debug = debug // pass along debugger for service
  req.BOARDS_SVC_HOST = BOARDS_SVC_HOST
  req.BOARDS_SVC_PORT = BOARDS_SVC_PORT
  res.locals.ua = req.get('user-agent')  // put user agent info into the response data for client side logic
  next()
})

var indexRouter = require('./routes/index')
var profileRouter = require('./routes/profile')
var sharedRouter = require('./routes/shared')
app.use('/', indexRouter)
app.use('/profile', profileRouter)
app.use('/shared', sharedRouter)
app.use(function(req, res, next) {
  next(createError(404)) // catch 404 and forward to error handler
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
