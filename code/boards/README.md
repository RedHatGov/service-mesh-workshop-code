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
  - default=`dummy`
- MONGODB_PASSWORD - overrride the password for database access
  - default=`dummy`
- MONGODB_SERVICE_HOST - override the database location
  - default=`localhost`
- MONGODB_SERVICE_PORT - override the database port
  - default=`27017`
- MONGODB_DATABASE - override the database name
  - default=`boardsDevelopment`
- MONGODB_USEAUTH - use auth when connecting to the database, defaults to true
  - default=`true`
- DEBUG - specify the debug loggers to print out (use a comma separated list: e.g `service,database,swagger-tools:middleware:*`)
  - default=empty
- BREAKME - set to `true` to force the service to spit out 503 errors
  - default=`false`

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

### Deploy / Run / Test Local Code to OpenShift - The easy way 
We can use odo to do our OpenShift deployments and iterations on code/test:
```
odo component create nodejs boards --now
odo service create mongodb-persistent --plan default --wait \
    -p DATABASE_SERVICE_NAME=boards-mongodb -p MONGODB_PASSWORD=dummy -p MONGODB_USER=dummy \
    -p MONGODB_DATABASE=boardsDevelopment -p VOLUME_CAPACITY=256Mi
odo link mongodb-persistent
odo config set --env MONGODB_SERVICE_HOST=boards-mongodb
odo push
```

### Deploy / Run / Test Local Code to OpenShift - The complicated but configurable YAML way
*(you will need a mongodb running first, and to match the config)*

You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/boards-fromsource.yaml \
    -p APPLICATION_NAME=boards \
    -p NODEJS_VERSION_TAG=10 \
    -p GIT_URI=https://github.com/dudash/openshift-microservices.git \
    -p GIT_BRANCH=develop \
    -p DATABASE_SERVICE_NAME=boards-mongodb \
    -p MONGODB_DATABASE=boardsDevelopment
```

### Building a container image for this service
You can use [s2i][5] to easily build this into a container image. For example to use the OpenShift runtimes node.js as our base:
```bash
rm -rf node_modules
s2i build . registry.access.redhat.com/ubi8/nodejs-12 openshift-microservices-boards --loglevel 3
```
Note: we remove the node_modules to avoid conflicts during the build process

### Developer Tips
- API is generated via [swagger-tools, read more here][3] [and here][4].
- MongoDB is being accessed via a thin helper library on top called monk. [Read how to use it here][2].
- Using DEBUG. Available debuggers are: service, database, swagger-tools:middleware:* 
- odo can be downloaded from here: https://docs.openshift.com/container-platform/4.3/cli_reference/openshift_developer_cli/installing-odo.html
- You can deploy a MongoDB container in OpenShift with: `oc new-app -e MONGODB_USER=dummy -e MONGODB_PASSWORD=dummy -e MONGODB_DATABASE=boardsDevelopment -e MONGODB_ADMIN_PASSWORD=dummy mongodb:latest`
  
[1]: https://www.apicur.io/
[2]: https://automattic.github.io/monk/
[3]: https://github.com/apigee-127/swagger-tools/blob/master/docs/QuickStart.md
[4]: https://developers.redhat.com/blog/2019/01/14/building-a-node-js-service-using-the-api-first-approach/
[5]: https://github.com/openshift/source-to-image/releases
