# Install config and instructions
This folder contains instructions on how to configure and install dependencies of the application as well as the app itself. You might need tweak or scrap things in here if you plan to leverage existing external services or just don't want to use something. We're trying to keep istio as an optional dependency so you can run it on vanilla OpenShift too (just with less operational capability).

Some notes on configuration file paths:
- `.s2i` folders will go in each microservice along with the code (because it's a build-time config)
- openshift/kubernetes resources required for running will live in `deployment/install/microservices/openshift-configuration/*.yaml`
- istio resources will live in the folders `deployment/install/microservices/istio-configuration/*.yaml`
- optional openshift resources for specific demo purposes can live in `deployemnt/demos/DEMOXYZ/openshift-configuration/*.yaml`
- optional istio resources for specific demo purposes can live in `deployemnt/demos/DEMOXYZ/istio-configuration/*.yaml`
- openshift build-time resources can live with the microservice in a `.openshift` folder (if it has something to demo with the build)

To get up and running you'll need to setup the platform dependencies on your cluster. Once those are available, follow the steps to install the application.

## Dependencies
### Istio
If using Istio, `cd istio` and [follow instructions here](./istio). As general rule all Deployment resources are annotated with `sidecar.istio.io/inject: "true"` which will be ignored in the case where you aren't using Istio.

### 3Scale
[COMING SOON](./3scale)

### Kafka (aka AMQ streams using Strimzi)
[FUTURE](./kafka)

### Distributed Cashing (Infinispan or Redis)
[FUTURE](./distributed-cache)

## The Application
`./microservices/services-install.sh` or `./microservices/services-install.sh --no-istio`
