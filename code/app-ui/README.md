# APP-UI
## The app's user interface
This microservice provides the main user interface into the application.

## Developer instructions

### Env Vars
- PORT, port to run the service (defaults to 8080 in PROD, 3000 in DEV)
- 
### Local Installation / Run / Test
```bash
$ npm install
```

Start the service:
```bash
$ npm run-script dev
```

### Running on OpenShift
You can use a template to create all the build and deployment resources for OpenShift. Here's an example that overrides the defaults:
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/app-ui-fromsource.yaml \
    -p APPLICATION_NAME=app-ui \
    -p NODEJS_VERSION_TAG=8-RHOAR \
    -p GIT_BRANCH=develop \
    -p GIT_URI=https://github.com/dudash/openshift-microservices.git
```
Note: the template uses S2I which pulls from git and builds the container image from source code then deploys.

### Building a container image for this service
You can use [s2i][2] to easily build this into a container image. For example to use the OpenShift runtimes node.js as our base:
```bash
rm -rf node_modules
s2i build . registry.access.redhat.com/ubi7/nodejs-8 openshift-microservices-app-ui --loglevel 3
```
Note: we remove the node_modules to avoid conflicts during the build process

### Developer Tips
Useful tool for converting HTML examples to pug files: [https://html2jade.org/][1]

[1]: https://html2jade.org/
[2]: https://github.com/openshift/source-to-image/releases
