# TODO - PLACEHOLDER

# Authentication
TBD

## Demo Steps
*TODO - write-up this demo after we integrate the SSO component*

We can sneak peak at our JWT with the following command:

```
curl -k -L -X POST 'https://keycloak-sso-shared.apps.cluster.domain.com/auth/realms/microservices-demo/protocol/openid-connect/token' -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=client-app' --data-urlencode 'grant_type=password' --data-urlencode 'scope=openid' --data-urlencode 'username=theterminator' --data-urlencode 'password=illbeback'
```

## Summary
TBD

<i class="fa fa-info-circle"></i>
If you have used RBAC prior to 1.4 of Istio you might have noticed that it's a lot easier now. Here's a blog post outlining the differences: [https://istio.io/blog/2019/v1beta1-authorization-policy/][6].

[1]: https://archive.istio.io/v1.4/docs/concepts/security/#authorization
[2]: https://www.keycloak.org/docs/latest/server_admin/#_clients
[3]: https://en.wikipedia.org/wiki/JSON_Web_Token
[4]: https://www.keycloak.org/docs/latest/securing_apps/
[5]: https://istio.io/docs/reference/config/policy-and-telemetry/templates/authorization/
[6]: https://istio.io/blog/2019/v1beta1-authorization-policy/