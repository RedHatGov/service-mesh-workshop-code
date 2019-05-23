# Secure Traffic
Let's take a look at how you can meet stricter security requirements with this application. Imagine a scenario where you are deploying this at a gov't agency or are expecting a lot of PII environment. In that scenario there's probably all sorts of security requirements to adhere to. One big requirement that could cause a lot of consternation on the development/operations team is to encrypt all service communications. In this demo we will show how Istio can help with that without requiring code changes, without complicated network updates, and without installing new tools or servers.

# Turn on mutual TLS for service-to-service authentication
Run the following Istio configuration updates:

`oc apply -f ./policy-default-enablemtls.yaml`

`oc apply -f ./destinationrules-mtls.yaml`

The first file applies the following [policy][5] update to tell the mesh to strictly enforce mutual TLS (encryption) for our services. We are effectively saying that all services will ONLY accept encrypted requests.
```yaml
apiVersion: authentication.istio.io/v1alpha1
kind: Policy
metadata:
  name: default
  namespace: microservices-demo
spec:
  peers:
  - mtls:
      mode: STRICT
```

And then for each service we update the a `DestinationRule` to with the policy below. This informs other services (clients) [to use mutual TLS when communicating with this service][4].
```yaml
trafficPolicy:
tls:
    mode: ISTIO_MUTUAL
```

*Note, Istio will manage certs and keys. But you could also you own certificates and keys if there is a requirement for that.*

# Rogue software can't talk to the services
As a quick test to show that Istio is enforcing our desired configuration let's try to talk to a service from a pod that doesn't have our TLS certificates.

Run the following to try to pull data from the boards service:

`oc run curl-boards --attach --rm --restart=Never --image=appropriate/curl --timeout=10s -- http://boards:8080/shareditems`

You should see a failure like this:
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (56) Recv failure: Connection reset by peer
pod "web-load" deleted
pod microservices-demo/web-load terminated (Error)
```

# Put things back the way they were and try that rogue test again

`oc apply -f  ../../../deployment/install/microservices/istio-configuration/policy-default-disablemtls.yaml`

`oc apply -f  ../../../deployment/install/microservices/istio-configuration/destinationrules.yaml`

and then:

`oc run curl-boards --attach --rm --restart=Never --image=appropriate/curl --timeout=10s -- http://boards:8080/shareditems`

You should see success with like this printing out your shared items (if you have any):
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   400  100   400    0     0  33333      0 --:--:-- --:--:-- --:--:-- 33333
[
  {
    "_id": "5ccb871cfa5ab60016b33374",
    "owner": "userX",
    "type": "string",
    "raw": "hi",
    "name": "",
    "id": "ObiAGZaUd",
    "created_at": "2019-05-03T00:11:08+00:00"
  },
  {
    "_id": "5ccc51d34cfcfe00161ef710",
    "owner": "userX",
    "type": "string",
    "raw": "this is good",
    "name": "",
    "id": "-4kF8UeJU",
    "created_at": "2019-05-03T14:36:03+00:00"
  }
]pod "web-load" deleted
```

# Summary
You can see that by running your services on top of Istio as a platform, advanced management of traffic security can be dynamically updated and mutual TLS encryption can easily be added into our application. The platform 
* Provides each service with a strong identity representing its role to enable interoperability across clusters and clouds
* Secures service-to-service communication and end-user-to-service communication
* Provides a key management system to automate key and certificate generation, distribution, and rotation
* Provides end-user authentication via JSON Web Tokens (JWT)

The architecture to make all this work is somewhat complicated. If you want to dig into the details, the best place to start is on [this Security Overview page][3].

[1]: https://istio.io/docs/tasks/security/mtls-migration/
[2]: https://istio.io/docs/tasks/security/mutual-tls/
[3]: https://istio.io/docs/concepts/security/
[4]: https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/#TLSSettings
[5]: https://istio.io/docs/reference/config/istio.authentication.v1alpha1/#PeerAuthenticationMethod