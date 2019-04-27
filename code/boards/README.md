# BOARDS
## Storing and managing the boards
This microservice provides the ability to add/remove and list boards along with the items in the boards. It stores the data in a MongoDB.

## API Documentation
The API has been visually designed via [Apicurio][1], it's based on the OpenAPI Specification. The item type is our main data class and it can be grouped via the board datatype.

The API is automatically created from the YAML spec along with swagger tools for testing it. If running on localhost it'd be accessible at:
* http://localhost:8080/docs/
* http://localhost:8080/api-docs

TODO - does the boards API need to know about users at all?  Can another service provide that API? e.g.
UI -<get /user345/boards/10>-> GATEWAY <-> Boards(validate user 345 access, mongodb: board10)
UI -<get /user345/boards/10>-> GATEWAY <-> Common(validate user 345 can access board 10) -<get /boards/10>-> Boards(mongodb: board10)


## Developer instructions

### Env Vars
- MONGODB_USER - overrride the user for database access
- MONGODB_PASSWORD - overrride the password for database access
- MONGODB_SERVICE_HOST - override the database location
- MONGODB_SERVICE_PORT - override the database port
- MONGODB_DATABASE - override the database name
- MONGODB_USEAUTH - use auth when connecting to the database, defaults to true
- DEBUG - specify the debug loggers to print out (use a comma separated list)

### Local Installation / Run / Test
Install the dependencies:
```bash
$ npm install
```

Start a database:
```bash
$ mkdir -p /tmp/data
$ mongod --dbpath=/tmp/data --port 27017
```

Start the service:
```bash
$ npm run-script dev
```

### Running on OpenShift
You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/boards-fromsource.yaml \
    -p APPLICATION_NAME=boards \
    -p NODEJS_VERSION_TAG=8-RHOAR \
    -p GIT_URI=https://github.com/dudash/openshift-microservices.git \
    -p GIT_BRANCH=peter-cotton-tail \
    -p DATABASE_SERVICE_NAME=boards-mongodb \
    -p MONGODB_DATABASE=boardsDevelopment
```

### Developer Tips
- API is generated via [swagger-tools, read more here][3] [and here][4].
- MongoDB is being accessed via a thin helper library on top called monk. [Read how to use it here][2].
- Using DEBUG. Available debuggers are: service, database, swagger-tools:middleware:* 

[1]: https://www.apicur.io/
[2]: https://automattic.github.io/monk/
[3]: https://github.com/apigee-127/swagger-tools/blob/master/docs/QuickStart.md
[4]: https://developers.redhat.com/blog/2019/01/14/building-a-node-js-service-using-the-api-first-approach/