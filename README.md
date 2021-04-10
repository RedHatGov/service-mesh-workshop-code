# THIS IS EXAMPLE CODE FOR THE SERVICE MESH WORKSHOP 
We will not be merging anything back from this repo to the upstream it was forked from. It can follow it's own path.

Also, note that this code intentionally has bugs, strange env vars, and unfinished parts - this is so that the workshop can demonstrate features of OpenShift and the OpenShift Service Mesh (Istio). This let's us examine use cases where the service mesh can aid in development as well as operational activities.

The main services used in the workshop are: app-ui, boards, context-scraper, profile service, and Keycloak (SSO)

[![OpenShift Version][openshift-heximage]][openshift-url]

You can find [the corresponding labs here](http://redhatgov.io/workshops/openshift_service_mesh/)

# Microservices
Microservices, also known as the microservice architecture, is a software development technique that structures an application as a collection of loosely coupled services. Microservice architectures enable the continuous delivery/deployment/scaling of complex applications.

This git repo showcases an app built using the microservice architecture with several intentionally simple components. The goal is to showcase an example way to develop and manage microservices using a container platform and service mesh.

## Why microservices?
Agility. Deliver application updates faster. Isolate and fix bugs easier. Done right, a microservices architecture will you help to meet several important non-functional requirements for your software:
* scalability
* performance
* reliability
* resiliency
* extensibility
* availability

## Current screenshot
![Screenshot](design/screenshots/2019-04-19_1042.png?raw=true)


## Here's the initial design for the architecture:

![Diagram](design/highlevel-arch.png)
*In the above diagram web app users are accessing the APP UI service which in turns calls chains of microservices on the backend. Optionally the backend services have calls to API services managed via 3scale (and future access to the services from mobile apps could go through the 3scale API management capability as well). A single sign on capability provides security around user access to the application via OpenID Connect (OIDC) and OAuth2. The Istio service mesh is shown too - it provides core capabilities for traffic management and security of the services as well as detailed observation into the application's operational status. All of this is running on top of an OpenShift cluster. (Additional service interactions and deployment details are in other diagrams).*

![Diagram](design/ocp-arch.png)
*The above diagram shows how the services are related and additionally how they are abstracted from the underlying infrastructure (compute and storage) when deployed on top of an OpenShift cluster. (The abstraction means this can be run in AWS, GCP, Azure, on-prem, or in some hybrid combination).*

###### :information_source: This example is based on OpenShift Container Platform version 4.3.

## How to run this?
We recommend using RHPDS (if you have access) to run this workshop.

To install everything:
- [Follow instructions here](./deployment/workshop/README.md)

Once you have the cluster pre-reqs up and running, the labs will walk you through install and using the application.


## About the code / software architecture
The parts in action here are:
* A set of microservices that together provide full application capability for a cut and paste board (in code folder)
* Key platform components that enable this example:
    * container building via s2i
    * service load balancing
    * service autoscaling
    * service health checks and recovery
    * dynamic storage allocation and persistent volume mapping
    * Kubernetes operators to manage middleware components (e.g. Kafka)
    * advanced service traffic management via Istio
    * additional service observability via Istio
* Middleware components in this example:
    * API management and metrics (on the external facing APIs)
    * authorization and application security via SSO
    * Kafka for scalable messaging


## References, useful links, good videos to check out
### Microservices
* [Microservices at Spotify Talk](https://www.youtube.com/watch?v=7LGPeBgNFuU)
* [Microservices at Uber Talk](https://www.youtube.com/watch?v=kb-m2fasdDY)
* [Mastering Chaos Netflix Talk](https://youtu.be/CZ3wIuvmHeM)
* [Red Hat Developer's Learning - Microservices](https://developers.redhat.com/learn/microservices/)
### Istio Service Mesh
* [What is Istio?](https://istio.io/docs/concepts/what-is-istio/)
* [Red Hat Developer's Istio Free Book](https://developers.redhat.com/books/introducing-istio-service-mesh-microservices/)
* [Free Hands-on with Istio](https://learn.openshift.com/servicemesh)
### Single Sign On
* [Keycloak SSO](https://www.keycloak.org/)


## License
Apache 2.0.


[openshift-heximage]: https://img.shields.io/badge/openshift-4.3-BB261A.svg
[openshift-url]: https://docs.openshift.com/container-platform/4.3/welcome/index.html