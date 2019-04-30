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

If running on localhost, the APU is accessible to test and download at:

* http://localhost:8080/swagger-ui
* http://localhost:8080/api-docs

## Developer instructions
- JDK 8+
- Apache Maven 3.5.3+ is required
- Optional for native applications [GraalVM](https://www.graalvm.org/) 


### Environment variables


* If building natively, set the 
```bash
$ GRAALVM_HOME=<GRAALVM_LOCATION>
```

### Local installation / run / test

#### Update the application.properties to include database info
Update the properties to point to local H2 database or a PostgreSQL database. 
 if using local or remote PostgreSQL database (default), set environment variables

```bash
POSTGRESQL_USER=sarah
POSTGRESQL_PASSWORD=connor
POSTGRESQL_DATABASE=userprofiledb
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
```
substitute with the appropriate values

If using H2 database, update application.properties with
```bash
quarkus.datasource.username=sarah
quarkus.datasource.password=connor
quarkus.datasource.url=jdbc:h2:file:/opt/h2/database.db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
quarkus.datasource.driver=org.h2.Driver
```


If you don't want to use an H2 or PostgreSQL database, there is an in-memory implementation. You will need to update the org.microservices.demo.rest.UserProfileResource.java file and update this code
```java
//@Qualifier("jpa")
@Qualifier("memory")
```
TODO: configure this change via application.properties

You may need to still need to set the datasource properties in application.properties to match the H2 settings so that the app runs

#### Running the app locally
```bash
$ ./mvnw compile quarkus:dev
```

#### Running the native app locally
Alternatively, you can build and run a native app. 
```bash
$ ./mvnw package -Pnative
$ ./target/userprofile-1.0-SNAPSHOT-runner
```
Note that the build will take a few minutes, however, the app boots up a lot faster

#### To view and test with Swagger-UI locally
http://localhost:8080/swagger-ui/


#### Photo/Image Testing
This is only supported with the jpa implementation

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

### Running on OpenShift

The OpenShift instructions will deploy a postgreSQL database and the userprofile microservice.

You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
USER_PROFILE_GIT_REPO=https://github.com/dudash/openshift-microservices
USER_PROFILE_GIT_BRANCH=master 
QUARKUS_VERSION_TAG=graalvm-1.0.0-rc15

oc new-app -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml -p QUARKUS_VERSION_TAG=${QUARKUS_VERSION_TAG} -p GIT_URI=${USER_PROFILE_GIT_REPO}  -p GIT_BRANCH=${USER_PROFILE_GIT_BRANCH} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST}

#To delete everything
# oc delete all,secrets,pvc -lapp=userprofile
# delete everything but data
# oc delete all,secrets -lapp=userprofile
```

### Building a container image for this service
You can use [s2i][4] to easily build this into a container image. For example to use the Quarkus Native image as our base:
```bash
s2i build . quay.io/quarkus/centos-quarkus-native-s2i:graalvm-1.0.0-rc15 openshift-microservices-userprofile --loglevel 3
```

[1]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/
[2]: https://www.keycloak.org/docs/4.8/getting_started/index.html
[3]: https://www.graalvm.org/
[4]: https://github.com/openshift/source-to-image/releases
