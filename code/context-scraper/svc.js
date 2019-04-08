// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

const SERVICE_NAME = process.env.SERVICE_NAME || 'context-scraper'

var app = express()
var port = process.env.PORT || '8080'
app.use(cors())
//app.use(bodyParser.json()) // https://expressjs.com/en/resources/middleware/body-parser.html
//app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(cookieParser()) // https://expressjs.com/en/resources/middleware/cookie-parser.html

app.use(function(req,res,next) {
    req.SERVICE_NAME = SERVICE_NAME
    next();
})

// TODO:
// propagate the following headers from the incoming request to any outgoing requests
// so that istio will be able to automatically enable Jaeger tracing
// x-request-id
// x-b3-traceid
// x-b3-spanid
// x-b3-parentspanid
// x-b3-sampled
// x-b3-flags
// x-ot-span-context

app.use('/scrape', require('./api_v1'))

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

app.listen(port, () => console.log(SERVICE_NAME + ` listening on port ${port}...`))
