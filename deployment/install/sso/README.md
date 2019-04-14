# Single Sign On
SSO is included as part of any middleware subscription you get from Red Hat - woot! Alternatively, you can use [Keycloak][3], the community upstream project for the SSO product.

## Prerequisites
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

## Install
You can install SSO by using one of the templates available in OpenShift. [Full details are here][2].


## Notes
SSO container images are pulled by your cluster from the Red Hat Registry: registry.redhat.io. To consume container images from registry.redhat.io in shared environments such as OpenShift, it is recommended for an administrator to use a Registry Service Account, also referred to as authentication tokens in place of an individual person’s Red Hat Customer Portal credentials. So if you haven't already you can [use this link to create a service account to access the Red Hat container registry][1] (instructions on how to import the secret are there also).


[1]: https://access.redhat.com/terms-based-registry/
[2]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/html-single/red_hat_single_sign-on_for_openshift/
[3]: https://www.keycloak.org/documentation.html