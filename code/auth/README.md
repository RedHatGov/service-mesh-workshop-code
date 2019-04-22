# Auth
Authentication and authorization is handled via customized configuration of Red Hat SSO (aka Keycloak).

## API documentation
N/A

## Developer instructions
This repo utilizes a OpenShift's source-to-image (s2i) for customizing and layering extra configuration into the Red Hat official SSO container. You can see the code in the following folders:
- `themes`
- `.s2i`

### Building this service
Build requires an OpenShift cluster or s2i
```bash
oc new-build redhat-sso-7/sso73-openshift:latest~/ --name=auth
  ```

### Running on OpenShift
```bash
oc new-app -f ./auth-sso73-with-postgres.json \
 -p SSO_ADMIN_USERNAME="admin" \
 -p SSO_ADMIN_PASSWORD="password" \
 -p SSO_REALM="microservices" \
 -p IMAGE_STREAM_NAMESPACE=microservices-demo
```

### Environment variables
A configmap must be created in order for clients to connect to the SSO service. Details are TBD.

