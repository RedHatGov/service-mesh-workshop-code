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
var debugSSO = require('debug')('sso')
var session = require('express-session') //Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.
var keycloak = require('keycloak-connect') // https://www.keycloak.org/docs/latest/securing_apps/#usage-2

const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http://'
const SERVICE_NAME = process.env.SERVICE_NAME || 'app-ui'
const BOARDS_SVC_HOST = process.env.BOARDS_SVC_HOST || 'boards'
const BOARDS_SVC_PORT = process.env.BOARDS_SVC_PORT || '8080'
const PROFILE_SVC_HOST = process.env.PROFILE_SVC_HOST || 'userprofile'
const PROFILE_SVC_PORT = process.env.PROFILE_SVC_PORT || '8080'
const SSO_SVC_HOST = process.env.SSO_SVC_HOST || 'sso73-x509'
const SSO_SVC_PORT = process.env.SSO_SVC_PORT || '8443'
const SESSION_SECRET = process.env.SESSION_SECRET || 'pleasechangeme'
const FAKE_USER = process.env.FAKE_USER || true

var app = express()
app.use(cors())

// Create a session-store for keycloak middleware.
// Warning! MemoryStore, is purposely not designed for a production environment. 
// It will leak memory under most conditions, does not scale past a single 
// process, and is meant for debugging and developing.
var memoryStore = new session.MemoryStore()
app.use(session({
  secret: SESSION_SECRET, // This is the secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine',  'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Choose to use this config variable vs. the keycloak.json file
debugSSO('using JavaScript config')
debugSSO('SSO_SVC_HOST=' + SSO_SVC_HOST)
debugSSO('SSO_SVC_PORT=' + SSO_SVC_PORT)
const authConfig = {
  'realm': 'microservices-demo',
  'auth-server-url': 'https://' + SSO_SVC_HOST + ':' + SSO_SVC_PORT + '/auth/',
  'ssl-required': 'external',
  'resource': 'client-app',
  'public-client': true,
  'verify-token-audience': true,
  'use-resource-role-mappings': true,
  'confidential-port': 0
}
var auth = new keycloak({store: memoryStore}, authConfig)
// Choose to use keycloak.json file vs. config variable
// debugSSO('using keycloak.json config')
// var auth = new SSO({store: memoryStore})
app.use(auth.middleware({logout: '/logout'}))

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

// we need to do real auth - for now dump some fake stuff in here
if (FAKE_USER) {
  app.use(function (req, res, next) {
    debug('injecting a FAKE user named: anonymous')
    res.locals.user = 'anonymous'
    res.locals.userId = '575ddb6a-8d2f-4baf-9e7e-4d0184d69259'
    res.locals.authenticated = true
    next()
  })
}

app.get('/login', auth.protect(), function (req, res) {
  debugSSO('login attempted')

  // TODO: set res.locals.user
  // TODO: set res.locals.userId
  // TODO: set res.locals.authenticated

  res.render('info-page', {
    infoDetails: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    infoMessage: '1. Authentication\n2. Login'
  })
  // res.redirect('back')
})

var indexRouter = require('./routes/index')
var profileRouter = require('./routes/profile')
var searchRouter = require('./routes/search')
var sharedRouter = require('./routes/shared')
var boardRouter = require('./routes/board')
app.use('/', indexRouter)
app.use('/profile', profileRouter)
app.use('/search', searchRouter)
app.use('/shared', sharedRouter)
app.use('/:user/board', boardRouter)
//app.use('/:user/dashboard', auth.protect('realm:user'), dashboardRouter)
//app.use('/:user/board', auth.protect('realm:user'), boardRouter) // must be logged in and have 'user' role in the realm. TODO: switch to this when SSO is ready

app.get('/info', function (req, res) {
  debug('info req:' + req.query.infoMessage)
  res.render('info-page', {
    infoAlert: req.query.infoAlert,
    infoAlertText: req.query.infoAlertText,
    infoMessage: req.query.infoMessage,
    infoDetails: req.query.infoDetails
  })
})

app.use(function(req, res, next) {
  next(createError(404)) // catch 404 and forward to error handler
})

// error handler
app.use(function(err, req, res, next) {
  debug('Error=' + err.message)
  debug('Error code=' + err.status)
  debug(err.stack)
  debug('---------------------------')
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
