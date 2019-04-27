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
    -p GIT_BRANCH=peter-cotton-tail
    -p GIT_URI=https://github.com/dudash/openshift-microservices.git
```
Note: the template uses S2I which pulls from git and builds the container image from source code then deploys.

### Developer Tips
Useful tool for converting HTML examples to pug files: [https://html2jade.org/][1]

[1]: https://html2jade.org/
