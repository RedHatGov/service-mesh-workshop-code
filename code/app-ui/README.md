# APP-UI
## The app's user interface
This microservice provides the main user interface into the application.

## Developer instructions

### Env Vars
- PORT, port to run the service (defaults to 8080 in PROD, 3000 in DEV)
- HTTP_PROTOCOL, default='http://'
- SERVICE_NAME, default='app-ui'
- BOARDS_SVC_HOST, default='boards'
- BOARDS_SVC_PORT, default='8080'
- PROFILE_SVC_HOST, default='profile'
- PROFILE_SVC_PORT, default='8080'
- SSO_SVC_HOST, default='auth-sso73-x509'
- SSO_SVC_PORT, default='8443'
- SESSION_SECRET, default='pleasechangeme'
- FAKE_USER, default=false (this turns off SSO checks and injects a fake user)
- NODE_TLS_REJECT_UNAUTHORIZED, default=unset (this tells node.js to reject or accept self-signed certs)
  
### Local Installation / Run / Test
```bash
$ npm install
```

Start the service:
```bash
$ npm run-script dev
```

### Deploy / Run / Test Local Code to OpenShift - The easy way 
We can use odo to do our OpenShift deployments and iterations on code/test:
```bash
odo component create nodejs app-ui --now
odo url create --port 8080
odo config set --env BOARDS_SVC_HOST=boards-app
odo push
```

### Deploy / Run / Test Local Code to OpenShift - The complicated but configurable YAML way
You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/app-ui-fromsource.yaml \
    -p APPLICATION_NAME=app-ui \
    -p NODEJS_VERSION_TAG=10 \
    -p GIT_BRANCH=develop \
    -p GIT_URI=https://github.com/dudash/openshift-microservices.git
```
Note: the template uses S2I which pulls from git and builds the container image from source code then deploys.

### Building a container image for this service
You can use [s2i][2] to build this into a container image. For example to use the OpenShift runtimes node.js as our base:
```bash
rm -rf node_modules
s2i build . registry.access.redhat.com/ubi8/nodejs-12 openshift-microservices-app-ui --loglevel 3
```
Note: we remove the node_modules to avoid conflicts during the build process

### Developer Tips
Useful tool for converting HTML examples to pug files: [https://html2jade.org/][1]

[1]: https://html2jade.org/
[2]: https://github.com/openshift/source-to-image/releases

### Other Notes
You will need to deploy the boards microservice for this app-ui to function properly.

If you have a self signed cert on your keycloak SSO you might need to tell node.js that's OK:
```export set NODE_TLS_REJECT_UNAUTHORIZED=0```

To debug your app in OpenShift you can use the following env vars:
* DEBUG = sso, app
* NODE_DEBUG = request