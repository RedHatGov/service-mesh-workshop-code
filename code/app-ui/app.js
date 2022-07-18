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

// get config variables from env variables
const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http://'
const SERVICE_NAME = process.env.SERVICE_NAME || 'app-ui'
const BOARDS_SVC_HOST = process.env.BOARDS_SVC_HOST || 'boards'
const BOARDS_SVC_PORT = process.env.BOARDS_SVC_PORT || '8080'
const PROFILE_SVC_HOST = process.env.PROFILE_SVC_HOST || 'userprofile'
const PROFILE_SVC_PORT = process.env.PROFILE_SVC_PORT || '8080'
const SSO_SVC_HOST = process.env.SSO_SVC_HOST || 'sso73-x509'
const SSO_SVC_PORT = process.env.SSO_SVC_PORT || '8443'
const SESSION_SECRET = process.env.SESSION_SECRET || 'pleasechangeme'
const FAKE_USER = process.env.FAKE_USER || false

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

app.use(function(req, res, next) {
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

// Ignore real auth and fake stuff in here
if (FAKE_USER === true || FAKE_USER == "true") {
  debugSSO('injecting a FAKE user named: anonymous with magic profile service key')
  app.use(function(req, res, next) {
    res.locals.username = 'Sarah'
    res.locals.userId = '575ddb6a-8d2f-4baf-9e7e-4d0184d69259'
    res.locals.authenticated = true
    res.locals.authToken = 'XXXXXXXXX'
    next()
  })
  app.get('/logout', function (req, res) {
    debugSSO('FAKE logout attempted')
    res.render('info-page', {
      infoMessage: "Can't logout FAKE user",
      infoDetails: "Please turn off FAKE_USER env variable to hookup to real SSO"
    })
  })
} else {
  // Choose to use this config variable vs. the keycloak.json file
  debugSSO('using JavaScript config')
  debugSSO('SSO_SVC_HOST=' + SSO_SVC_HOST)
  debugSSO('SSO_SVC_PORT=' + SSO_SVC_PORT)
  const authConfig = {
    'realm': 'microservices-demo',
    'auth-server-url': 'https://' + SSO_SVC_HOST + '/auth',
    'ssl-required': 'external',
    'resource': 'client-app',
    'public-client': true,
    'verify-token-audience': false,
    'use-resource-role-mappings': true,
    'confidential-port': 0
  }
  var auth = new keycloak({store: memoryStore}, authConfig)
  // Choose to use keycloak.json file vs. config variable
  // debugSSO('using keycloak.json config')
  // var auth = new SSO({store: memoryStore})
  app.use(auth.middleware({logout: '/logout'}))
  // check SSO status before every call - TODO what happens when SSO is unreachable?
  app.use(auth.checkSso(), function (req, res, next) {
    var authenticated = 'Check SSO Success (' + (req.session['keycloak-token'] ? 'Authenticated' : 'Not Authenticated') + ')'
    debugSSO(authenticated)
    if ((req.session['keycloak-token'] ? true : false) && req.kauth.grant.access_token != null) {
      res.locals.username = req.kauth.grant.access_token.content.name
      res.locals.useremail = req.kauth.grant.access_token.content.email
      res.locals.userId = req.kauth.grant.access_token.content.preferred_username
      res.locals.authToken = req.kauth.grant.access_token.token
      res.locals.authenticated=true
    } else { // not authenticated or auth invalid
      debugSSO('no session or token is missing - clearing user')
      res.locals.username = ''
      res.locals.useremail = ''
      res.locals.userId = ''
      res.locals.authToken = ''
      res.locals.authenticated=false
    }
    next()
  })
  app.get('/login', auth.protect(), function (req, res) {
    debugSSO('login attempted')
    debugSSO(req.session)
    debugSSO(req.kauth.grant.access_token.header)
    debugSSO(req.kauth.grant.access_token.content)
    res.locals.username = req.kauth.grant.access_token.content.name
    res.locals.useremail = req.kauth.grant.access_token.content.email
    res.locals.userId = req.kauth.grant.access_token.content.preferred_username
    res.locals.authToken = req.kauth.grant.access_token.token
    res.locals.authenticated=true
    res.redirect('back')
  })
}

var indexRouter = require('./routes/index')
var profileRouter = require('./routes/profile')
var searchRouter = require('./routes/search')
var sharedRouter = require('./routes/shared')
var boardRouter = require('./routes/board')
app.use('/', indexRouter)  // check sso to pull in the user details and bearer token
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
