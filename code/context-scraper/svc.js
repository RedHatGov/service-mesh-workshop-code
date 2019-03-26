var express = require('express')
var cors = require('cors')

const SERVICE_NAME = process.env.SERVICE_NAME || 'microservices-demo'

var app = express()
var port = process.env.PORT || '8080'
app.use(cors())

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(cookieParser())

app.use(function(req,res,next) {
    req.SERVICE_NAME = SERVICE_NAME
    next();
})

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
