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
var debugdb = require('debug')('database')

const SERVICE_NAME = process.env.SERVICE_NAME || 'boards'

// database setup
var user = process.env.MONGODB_USER || 'dummy'
var pass = process.env.MONGODB_PASSWORD || 'dummy'
var dbip = process.env.MONGODB_SERVICE_HOST || 'localhost'
var dbport = process.env.MONGODB_SERVICE_PORT || 27017
var dbproj = process.env.MONGODB_DATABASE || 'microservicesDev'
//var dbproj = process.env.MONGODB_DATABASE || 'microservicesTest'
//var dbdbprojcoll = process.env.MONGODB_DATABASE || 'microservicesProd'
var useAuth = process.env.MONGODB_USEAUTH || 'true'
if (useAuth === 'false') {
    debugdb('mongodb with no auth')
    var url = dbip+':'+dbport+'/'+dbproj
}
else {
    debugdb('mongodb with user/password auth')
    var url = user+':'+pass+'@'+dbip+':'+dbport+'/'+dbproj
}
debugdb('connecting to mongodb at ' + url)
var monk = require('monk')
var db = monk(url);
db.then(() => { debugdb('Connected correctly to database server') })

var app = express()
var port = process.env.PORT || '8080'

// var propagateTrace = require('istio-tracing-headers')
// app.use(propagateTrace())

// SwaggerRouter
var swaggerTools = require('swagger-tools');
var yaml = require('js-yaml');
var fs = require('fs');
var options = { controllers: './controllers', useStubs: true };
var swaggerDoc = yaml.safeLoad(fs.readFileSync('./boardsapi.yaml', 'utf8'));

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    app.use(middleware.swaggerMetadata()) // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerValidator()) // Validate Swagger requests
    app.use(middleware.swaggerRouter(options)) // Route validated requests to appropriate controller
    app.use(middleware.swaggerUi()) // Serve the Swagger documents and Swagger UI
})

app.use(function(req,res,next) {
    req.SERVICE_NAME = SERVICE_NAME
    req.db = db  // make db available to routes
    req.debugdb = debugdb // pass along debugger for db
    req.debug = debug // pass along debugger for service
    next()
})

app.listen(port, () => debug(SERVICE_NAME + ` listening on port ${port}...`))
