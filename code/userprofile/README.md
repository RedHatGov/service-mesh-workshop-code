# USER PROFILE
## Store user profile details
Stores details about the user. A user profile includes:
* email address
* userid
* first_name
* last_name
* photo
* about_me
* created_at
* image

Note that users are stored in SSO and authorization/authentication is handled by SSO, but some additional characteristics are persisted and served via this service.
 
Open questions/notes:
- can we just use SSO and custom user attributes for this?
- https://www.keycloak.org/docs/4.8/server_admin/index.html#user-attributes
- TBD PROS/CONS of each approach
- breaking up a microservice can be be a tricky thing, for this first pass as a small system we don't want to create unnecessary network traffic and complexity without needing it. So our first pass will be to favor coupling related biz requirements and refactor later if necessary. So in this case a single service for user profile AND user preferences. This could later be broken into two if needed.
- TBD look here for example: https://github.com/NAPS-emergency-response-project/emergency-sso
  

## API documentation
The API has been visually designed via Apicurio, it's based on the OpenAPI Specification. see userprofile_v1_api.yaml

If running on localhost, the API is accessible to test and download at:

* http://localhost:8080/swagger-ui
* http://localhost:8080/api-docs

A fake user can be retrieved by asking for user with ID of "575ddb6a-8d2f-4baf-9e7e-4d0184d69259"


## Developer instructions
- JDK 8+
- Apache Maven 3.5.3+ is required
- Optional for native applications [GraalVM](https://www.graalvm.org/) . At least version 19.2.1 required


### Environment variables
If building natively, set the location of GRAAVLM_HOME
```bash
$ GRAALVM_HOME=<GRAALVM_LOCATION>
```

### Local installation / run / test

#### Database settings
 H2 Database (for debugging) or Postgresql is supported

 if using PostgreSQL database (default), set the environment variables when testing locally and substitute with the appropriate values

```bash
POSTGRESQL_USER=sarah
POSTGRESQL_PASSWORD=connor
POSTGRESQL_DATABASE=userprofiledb
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
```

#### Running the app with H2
```bash
 mvn compile quarkus:dev -Dquarkus.profile=local
```

#### Running the app with Postgres database
```bash
 mvn compile quarkus:dev  
```

#### Running the native app (only Postgres support)
Alternatively, you can build and run a native app.
Note that the build will take a few minutes longer, however, the app boots up a lot faster

```bash
 mvn package -Pnative
 ./target/userprofile-1.0-SNAPSHOT-runner
```

#### To view and test with Swagger-UI locally (jvm mode only)
http://localhost:8080/swagger-ui/


#### Photo/Image Testing
Users have the ability to upload a profile picture 

##### To test photo upload
The requested user has to exist

```bash
IMAGE_FILE=<image_file>
USER_ID=<userid>
curl -v -X  POST -H 'content-type: multipart/form-data' -F image=@${IMAGE_FILE} http://localhost:8080/users/$USER_ID/photo
```
##### To test photo download
The requested user has to exist

```bash
USER_ID=<userid>
curl -v -X  GET  http://localhost:8080/users/$USER_ID/photo
```

This produces content of type 'application/octet-stream'. You can redirect the output to a file


### Deploy / Run / Test Local Code to OpenShift - The easy way 
We can use odo to do our OpenShift deployments and iterations on code/test:
```bash
odo component create java:11 userprofile \
    --env ARTIFACT_COPY_ARGS="-p -r lib/ *-runner.jar" --env JAVA_OPTIONS=-Dquarkus.http.host=0.0.0.0
odo url create --port 8080
odo config set --env DATABASE_SERVICE_NAME=userprofile-postgresql
odo push
odo service create postgresql-persistent --plan default --wait \
    -p POSTGRESQL_DATABASE=userprofiledb -p POSTGRESQL_USER=sarah \
    -p POSTGRESQL_PASSWORD=connor -p VOLUME_CAPACITY=256Mi \
    -p DATABASE_SERVICE_NAME=userprofile-postgresql
odo link postgresql-persistent
```

### Deploy / Run / Test Local Code on OpenShift - The complicated but configurable YAML way 

The OpenShift instructions will deploy a postgreSQL database and the userprofile microservice.

You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
USER_PROFILE_GIT_REPO=https://github.com/dudash/openshift-microservices
USER_PROFILE_GIT_BRANCH=master
QUARKUS_NATIVE_IMAGE_VERSION_TAG=19.2.1
APPLICATION_NAME=openshift-microservices-userprofile
```
#### Deploying native container (slower build, extra-fast startup time)
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml -p QUARKUS_NATIVE_IMAGE_VERSION_TAG=${QUARKUS_NATIVE_IMAGE_VERSION_TAG} -p GIT_URI=${USER_PROFILE_GIT_REPO}  -p GIT_BRANCH=${USER_PROFILE_GIT_BRANCH} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST} -p APPLICATION_NAME=$APPLICATION_NAME
```

*For the native build to be successful in an OpenShift cluster with Pod and container resource limits, you may need to increase the cpu and memory resource limits for the container and pods within the OpenShift project.*

#### Alternate deployment - Deploying jvm-based container (faster build, regular startup time)
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource-jvm.yaml -p GIT_URI=${USER_PROFILE_GIT_REPO}  -p GIT_BRANCH=${USER_PROFILE_GIT_BRANCH} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST}  -p APPLICATION_NAME=$APPLICATION_NAME
```

#### To Cleanup OpenShift Deployment
```bash
#delete everything but data (ie saved profiles)
oc delete all,secrets -lapp=$APPLICATION_NAME
#delete everything
oc delete all,secrets,pvc -lapp=$APPLICATION_NAME
```

### Building a container image for this service
You can use [s2i][4] to easily build this into a native container image. For example to use the Quarkus Native image as our base:

#### Native image
```bash
QUARKUS_NATIVE_IMAGE_VERSION_TAG=19.2.1
s2i build . quay.io/quarkus/ubi-quarkus-native-s2i:$QUARKUS_NATIVE_IMAGE_VERSION_TAG openshift-microservices-userprofile --loglevel 3
```

#### JVM image
```bash
s2i build . fabric8/java-alpine-openjdk8-jre:1.6.5 openshift-microservices-userprofile-jvm --loglevel 3
```

If you prefer to use docker/buildah -

#### To build native image  
```bash
mvn package -Pnative -Dquarkus.native.container-build=true
docker build -f src/main/docker/Dockerfile.native -t quarkus/openshift-microservices-userprofile .
```

#### To build jvm-based image  
```bash
mvn package
docker build -f src/main/docker/Dockerfile.jvm -t quarkus/openshift-microservices-userprofile-jvm .
```

[1]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/
[2]: https://www.keycloak.org/docs/4.8/getting_started/index.html
[3]: https://www.graalvm.org/
[4]: https://github.com/openshift/source-to-image/releases
