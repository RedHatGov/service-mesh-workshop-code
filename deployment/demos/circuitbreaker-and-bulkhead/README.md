# Circuit Breakers and Bulkheads
When implementing microservices you now have many individual services required to complete a part of the app’s overall functionality. Any of these services can fail individually. And that failure could be permanent or just temporary.

Obviously, calling code should be prepared to handle failures, but sometimes failure isn’t instantaneous (e.g. 15 sec before you get an error response). Cascading failures are even worse as they are failures that happen as part of a chain of many microservice interactions. The last service in a chain of calls could fail rendering that whole path a failure. Or a failure from one service can cause additional load and adverse effects on otherwise healthy services.  

As an example: imagine a pinterest type service where we can upload photos. But something is wrong with the upload service. Do you tell the user the app is broken and say - “sorry nothing works?” I hope not, the code could/should still allow users to view, comment, and use the app otherwise. But you’ve got this long timeout that locks up the app every time they try uploading. That’s bad. You need another solution... 

Let's take a look at implementing circuit breaking and bulkheads to help with partial outages and cascading failures.

## About Circuit Breaking
A circuit breaker in your house is an automatic switch designed to protect from damage caused by a current overload. Its basic function is to interrupt current flow after a fault is detected. [Circuit breakers in microservices][1] serve a similar function. Once network (HTTP/TCP) failures reach a certain threshold the circuit breaker trips, and all further calls to the failing service return with an immediate error. Keep in mind that on OpenShift you will typically be running multiple replicated instances of your service so only the failing instance would be breaker-tripped; the replicated instances would still serve traffic.

## About Bulkheads
Bulkheads in ships create watertight compartments that can contain water in the case of a hull breach or other leak. Bulkheads in microservices can be used as a way to preventing a catastrophic failure by degrading the system. And furthermore, they can be used to [drop traffic and recover a system from cascading failures][2].

## Demo Steps
This demo shows how Istio can be used to add circuit breaking and connection bulkheading capabilities to the services of our app.

### 1. Put some load on the app
We can use OpenShift to pull a container image containing the fortio load test tool and run it (from inside the mesh) to see how this app would respond at scale. Try running a few commands like the one below to put load on our app.

`oc run web-load --image=istio/fortio -- load -c 3 -qps 0 -n 100 -loglevel Warning http://app_ui:8080/shareditems`

The result should look like:
```
TODO
```

### 2. Configure the service to use circuit breaking and bulkheading
Run the following to apply a dynamic update to the DestinationRule for the boards service:
`oc apply -f circuitbreaker-boards.yaml`

The following rule sets a TCP/HTTP connection pool size of 2 connections and allows 5 concurrent HTTP2 requests, with no more than 2 req/connection to each boards service instance.

It also configures boards service instances to be scanned every 10 seconds. And any instance that fails 2 consecutive times with 5XX error code will be ejected from the load balanced pool for 5 minutes.

```yaml
trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 2
      http:
        http2MaxRequests: 5
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 2
      interval: 10s
      baseEjectionTime: 5m
```

### 3. Fill the bulkhead
Now that we applied the pattern, let's run the same command as before and fill up a connection pool (bulkhead):

`oc run web-load --image=istio/fortio -- load -c 3 -qps 0 -n 100 -loglevel Warning http://app_ui:8080/shareditems`

The result should look like:
```
TODO
```

### 4. Break the app and Trip the breaker
Now let's try to trip the circuit breaker by temporarily faking an error into the boards service. Run this to stop the database:
`oc scale --replicas=0 dc boards-mongodb`

Now if you went to the main website for the app and tried to view the shared boards you would see:
![Screenshot](./spinspin.gif?raw=true)

And for each user request incoming the app-ui service will timeout eventually with an error like this:
![Screenshot](./timeout.png?raw=true)

So now run the same load test as before to see that Istio immediately returns 5xx on the tripped circuit breaker vs. waiting for each call to fail after waiting for a long timeout on the database.

`oc run web-load --image=istio/fortio -- load -c 3 -qps 0 -n 100 -loglevel Warning http://app_ui:8080/shareditems`

The result should look like:
```
TODO
```

## That's it!
The basic circuit breaker and bulkhead patterns can be useful when operating a microservices based application. Istio has the basic capability for both of these patterns. It's language independent and you can configure the capability at runtime without any code changes.

Read more about these capabilities in Istio [here][3] and check out the [configuration reference here][4].

[1]: https://martinfowler.com/bliki/CircuitBreaker.html
[2]: https://landing.google.com/sre/sre-book/chapters/addressing-cascading-failures/
[3]: https://istio.io/docs/tasks/traffic-management/circuit-breaking/
[4]: https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/