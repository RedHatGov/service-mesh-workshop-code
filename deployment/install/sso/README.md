# Auth via SSO
Login, registration, and role-based authorization is handled via Red Hat SSO (aka Keycloak).
SSO is included as part of OpenShift or any middleware product subscription you have from Red Hat - woot!

## Installation
We install via Operator into OpenShift as follows:
* TBD - Translate the directions here to CLI or script
  * https://middlewareblog.redhat.com/2020/01/08/getting-started-with-the-keycloak-sso-operator/

## Configuration
We configure via Kubernetes resources to create the realm, clients, users, roles, and a theme as follows:
* TBD

## Access Info / API documentation
- Admin can login at: https://auth-microservices-demo.apps.YOURCLUSTER.COM/
- Users will login at: https://auth-microservices-demo.apps.YOURCLUSTER.COM/auth/realms/microservices/account

[1]: https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.3/html-single/red_hat_single_sign-on_for_openshift/
[2]: https://www.keycloak.org/documentation.html
[3]: https://github.com/openshift/source-to-image/releases
