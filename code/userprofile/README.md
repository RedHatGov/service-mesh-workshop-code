# USER PROFILE
## Store user profile details
Stores details about the user. A user profile includes:
* email address
* username
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
TBD

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

#### Running the app locally
```bash
$ ./mvnw compile quarkus:dev
```

#### Running the native app locally
```bash
$ ./mvnw package -Pnative
$ ./target/userprofile-1.0-SNAPSHOT-runner
```

#### To view and test with Swagger-UI locally
http://localhost:8080/swagger-ui/

### Running on OpenShift
```bash
TBD
```

### Developer tips
TBD 



[1]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/
[2]: https://www.keycloak.org/docs/4.8/getting_started/index.html
[3]: https://www.graalvm.org/