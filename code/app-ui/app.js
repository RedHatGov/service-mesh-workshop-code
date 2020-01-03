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
var session = require('express-session') //Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.
var SSO = require('keycloak-connect') // https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter

const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http://'
const SERVICE_NAME = process.env.SERVICE_NAME || 'app-ui'
const BOARDS_SVC_HOST = process.env.BOARDS_SVC_HOST || 'boards'
const BOARDS_SVC_PORT = process.env.BOARDS_SVC_PORT || '8080'
const PROFILE_SVC_HOST = process.env.PROFILE_SVC_HOST || 'profile'
const PROFILE_SVC_PORT = process.env.PROFILE_SVC_PORT || '8080'
const SSO_SVC_HOST = process.env.SSO_SVC_HOST || 'auth-sso73-x509'
const SSO_SVC_PORT = process.env.SSO_SVC_PORT || '8443'
const SESSION_SECRET = process.env.SESSION_SECRET || 'pleasechangeme'

var app = express()
app.use(cors())

// Create a session-store for keycloak middleware.
// Warning! MemoryStore, is purposely not designed for a production environment. 
// It will leak memory under most conditions, does not scale past a single 
// process, and is meant for debugging and developing.
var memoryStore = new session.MemoryStore();
app.use(session({
  secret: SESSION_SECRET, // This is the secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine',  'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
var auth = new SSO({store: memoryStore});
app.use(auth.middleware({logout: '/logout'}));

app.use(function(req,res,next) {
  req.SERVICE_NAME = SERVICE_NAME
  req.debug = debug // pass along debugger for service
  req.HTTP_PROTOCOL = HTTP_PROTOCOL
  req.BOARDS_SVC_HOST = BOARDS_SVC_HOST
  req.BOARDS_SVC_PORT = BOARDS_SVC_PORT
  req.PROFILE_SVC_HOST = PROFILE_SVC_HOST
  req.PROFILE_SVC_PORT = PROFILE_SVC_PORT
  res.locals.ua = req.get('user-agent')  // put user agent info into the response data for client side logic
  next()
})

// TODO: we need to do real auth
app.use(function (req, res, next) {
  res.locals.user = 'anonymous'
  res.locals.authenticated = false
  next()
})

var indexRouter = require('./routes/index')
var profileRouter = require('./routes/profile')
var sharedRouter = require('./routes/shared')
var boardRouter = require('./routes/board')
app.use('/', indexRouter)
app.use('/profile', profileRouter)
app.use('/shared', sharedRouter)
app.use('/:user/board', boardRouter)
//app.use('/:user/dashboard', auth.protect('realm:user'), dashboardRouter)
//app.use('/:user/board', auth.protect('realm:user'), boardRouter) // must be logged in and have 'user' role in the realm. TODO: switch to this when SSO is ready

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
