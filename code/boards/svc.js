// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var swaggerTools = require('swagger-tools');
var yaml = require('js-yaml');
var fs = require('fs');

const SERVICE_NAME = process.env.SERVICE_NAME || 'boards'

var app = express()
var port = process.env.PORT || '8080'
// app.use(cors())
// app.use(bodyParser.json()) // https://expressjs.com/en/resources/middleware/body-parser.html
// app.use(cookieParser()) // https://expressjs.com/en/resources/middleware/cookie-parser.html

// swaggerRouter configuration
var options = { controllers: './controllers', useStubs: true };
var swaggerDoc = yaml.safeLoad(fs.readFileSync('./boardsapi_v1.yaml', 'utf8'));
//require('./boardsapi_v1.yaml');
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    app.use(middleware.swaggerMetadata()); // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerValidator()); // Validate Swagger requests
    app.use(middleware.swaggerRouter(options)); // Route validated requests to appropriate controller
    app.use(middleware.swaggerUi()); // Serve the Swagger documents and Swagger UI
});

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
//

app.listen(port, () => console.log(SERVICE_NAME + ` listening on port ${port}...`))
