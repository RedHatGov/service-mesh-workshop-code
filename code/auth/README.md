# Auth
Authentication and authorization is handled via customized configuration of Red Hat SSO (aka Keycloak).

## API documentation
N/A

## Developer instructions
This repo utilizes a OpenShift's source-to-image (s2i) for customizing and layering extra configuration into the Red Hat official SSO container. You can see the code in the following folders:
- `themes`
- `.s2i`

### Building this service
Build requires an OpenShift cluster the new-build must point to a git repo or be pointing to a locally cloned branch. For secrets, branches and other options type `oc new-build -h`
```bash
oc new-build redhat-sso-7/sso73-openshift:latest~. --name=auth
```

### Running on OpenShift
You can use the template to create all the OpenShift resources. Optionally, set parameters:
- AUTH_IMAGE_STREAM_NAMESPACE
- SSO_ADMIN_USERNAME
- SSO_ADMIN_PASSWORD
- SSO_REALM
- APPLICATION_NAME

For example:
```bash
oc new-app -f ./auth-sso73-x509-postgresql-persistent.yaml \
 -p SSO_ADMIN_USERNAME="admin" \
 -p SSO_ADMIN_PASSWORD="password" \
 -p SSO_REALM="microservices" \
 -p AUTH_IMAGE_STREAM_NAMESPACE=YOUR_PROJECT_NAME
```

### Environment variables
A configmap must be created in order for clients to connect to the SSO service. Details are TBD.
```bash
route_name=$(oc get routes -l app=auth | { read line1 ; read line2 ; echo "$line2" ; } | awk '{print $2;}')
oc create configmap sso-config \
    --from-literal=AUTH_URL=https:\/\/${route_name}/auth \
    --from-literal=KEYCLOAK=true \
    --from-literal=PUBLIC_KEY=MANUALLY_GET_THIS_FROM_AUTH_SERVICE_AND_UPDATE_ME
```