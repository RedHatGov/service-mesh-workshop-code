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
- breaking up a microservice can be be a tricky thing, for this first pass as a small system we don't want to create unnecessary network traffic and complexity without needing it. So our first pass will be to favor coupling related biz reqwuirements and refactor later if necessary. So in this case a single service for user profile AND user preferences. This could later be broken into two if needed.
- TBD look here for example: https://github.com/NAPS-emergency-response-project/emergency-sso
  

## API documentation
TBD

## Developer instructions


### Environment variables
* TBD

### Local installation / run / test
```bash
$ npm install
```

#### Running the app locally
```bash
$ npm start
```

### Running on OpenShift
```bash
TBD
```

### Developer tips
TBD 


[1]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/
[2]: https://www.keycloak.org/docs/4.8/getting_started/index.html
