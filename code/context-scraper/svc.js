// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var debug = require('debug')('service')

const SERVICE_NAME = process.env.SERVICE_NAME || 'context-scraper'

var app = express()
var port = process.env.PORT || '8080'
app.use(cors())
app.use(cookieParser()) // https://expressjs.com/en/resources/middleware/cookie-parser.html

app.use(function(req,res,next) {
    req.SERVICE_NAME = SERVICE_NAME
    req.debug = debug // pass along debugger for service
    next()
})

// var propagateTrace = require('istio-tracing-headers')
// app.use(propagateTrace())

app.use('/scrape', require('./api'))

app.use(function(req, res, next) { // catch 404 and forward to error handler
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

if (process.env.DEBUG_STACK_TRACE === 'true') {
    // We will dump to screen
} else {
    app.use(function(err, req, res, next) { // no stack traces leaked to user
    res.status(err.status || 500).json({oops: err.message,error:'hidden'})})
}

app.listen(port, () => debug(SERVICE_NAME + ` listening on port ${port}...`))