# Auth
Authentication and authorization is handled via customized configuration of Red Hat SSO (aka Keycloak).
SSO is included as part of any middleware subscription you get from Red Hat - woot! Alternatively, you can use [Keycloak][3], the community upstream project for the SSO product.

## Prerequisites (admin required if installing into openshift namespace)
Ensure you OpenShift cluster has the latest templates/imagestreams (or at least 7.3). Here is a quick set of commands to help you do that for 7.3:
```
for resource in sso73-image-stream.json \
  sso73-https.json \
  sso73-mysql.json \
  sso73-mysql-persistent.json \
  sso73-postgresql.json \
  sso73-postgresql-persistent.json \
  sso73-x509-https.json \
  sso73-x509-mysql-persistent.json \
  sso73-x509-postgresql-persistent.json
do
  oc replace -n openshift --force -f \
  https://raw.githubusercontent.com/jboss-container-images/redhat-sso-7-openshift-image/sso73-dev/templates/${resource}
done
```

```
oc -n openshift import-image redhat-sso73-openshift:1.0
```

*(do only if you already have an image stream pointing to the old Red Hat registry...)*
```
oc get is redhat-sso73-openshift -o json | sed "s/registry.redhat.io/registry.access.redhat.com/g" | oc replace --force -f -
```

## API documentation
N/A
- Admin can login at: https://auth-microservices-demo.apps.YOURCLUSTER.COM/
- Users will login at: https://auth-microservices-demo.apps.YOURCLUSTER.COM/auth/realms/microservices/protocol/openid-connect

## Developer instructions
This repo utilizes a OpenShift's source-to-image (s2i) for customizing and layering extra configuration into the Red Hat official SSO container. You can see the code in the following folders:
- `themes`
- `.s2i`

### Building this service
Build requires an OpenShift cluster the new-build must point to a git repo or be pointing to a locally cloned branch. For secrets, branches and other options type `oc new-build -h`
```bash
oc new-build redhat-sso-7/sso73-openshift:latest~https://github.com/dudash/openshift-microservices.git#develop \
    --name=auth \
    -l app=auth-sso73-x509
```

### Building a container image for this service
As an alternative to building on OpenShift, you can use [s2i][4] to build this into a container image. For example:
```bash
rm -rf node_modules
s2i build . registry.access.redhat.com/redhat-sso-7/sso73-openshift openshift-microservices-auth
```

### Running on OpenShift
You can use a template to create all the OpenShift resources. Optionally, set parameters:
- AUTH_IMAGE_STREAM_NAMESPACE
- SSO_ADMIN_USERNAME
- SSO_ADMIN_PASSWORD
- SSO_REALM
- APPLICATION_NAME

For example:
```bash
oc new-app -f ../../deployment/install/microservices/openshift-configuration/auth-sso73-x509.yaml \
 -p SSO_ADMIN_USERNAME="admin" \
 -p SSO_ADMIN_PASSWORD="password" \
 -p SSO_REALM="microservices" \
 -p AUTH_IMAGE_STREAM_NAMESPACE=microservices-demo
```

deleting services related to this app only:
```bash
oc delete all -l app=auth-sso73-x509
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

### Common Issues
- I don't have access to the SSO container images...
    SSO container images are pulled by your cluster from the Red Hat Registry: registry.redhat.io. To consume container images from registry.redhat.io in shared environments such as OpenShift, it is recommended for an administrator to use a Registry Service Account, also referred to as authentication tokens in place of an individual person’s Red Hat Customer Portal credentials. So if you haven't already you can [use this link to create a service account to access the Red Hat container registry][1] (instructions on how to import the secret are there also).



[1]: https://access.redhat.com/terms-based-registry/
[2]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/html-single/red_hat_single_sign-on_for_openshift/
[3]: https://www.keycloak.org/documentation.html
[4]: https://github.com/openshift/source-to-image/releases
