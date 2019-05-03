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
We can use OpenShift to pull a container image containing the fortio load test tool and run it (from inside the mesh) to see how individual services will respond at scale. Try running a few commands like the one below to put out some load.

`oc run web-load --attach --rm --restart=Never --image=istio/fortio -- load -c 5 -qps 0 -n 100 -loglevel Warning http://boards:8080/shareditems`

The result should look like:
```
03:32:49 I logger.go:97> Log level is now 3 Warning (was 2 Info)
Fortio 1.3.2-pre running at 0 queries per second, 2->2 procs, for 100 calls: http://boards:8080/shareditems 
Starting at max qps with 5 thread(s) [gomax 2] for exactly 100 calls (20 per thread + 0)
Ended after 198.75734ms : 100 calls. qps=503.13
Aggregated Function Time : count 100 avg 0.0096226747 +/- 0.008179 min 0.002403803 max 0.050231693 sum 0.962267469
# range, mid point, percentile, count
>= 0.0024038 <= 0.003 , 0.0027019 , 4.00, 4
> 0.003 <= 0.004 , 0.0035 , 8.00, 4
> 0.004 <= 0.005 , 0.0045 , 25.00, 17
> 0.005 <= 0.006 , 0.0055 , 33.00, 8
> 0.006 <= 0.007 , 0.0065 , 49.00, 16
> 0.007 <= 0.008 , 0.0075 , 59.00, 10
> 0.008 <= 0.009 , 0.0085 , 67.00, 8
> 0.009 <= 0.01 , 0.0095 , 75.00, 8
> 0.01 <= 0.011 , 0.0105 , 76.00, 1
> 0.011 <= 0.012 , 0.0115 , 77.00, 1
> 0.012 <= 0.014 , 0.013 , 84.00, 7
> 0.014 <= 0.016 , 0.015 , 89.00, 5
> 0.016 <= 0.018 , 0.017 , 90.00, 1
> 0.018 <= 0.02 , 0.019 , 94.00, 4
> 0.02 <= 0.025 , 0.0225 , 95.00, 1
> 0.025 <= 0.03 , 0.0275 , 97.00, 2
> 0.04 <= 0.045 , 0.0425 , 98.00, 1
> 0.045 <= 0.05 , 0.0475 , 99.00, 1
> 0.05 <= 0.0502317 , 0.0501158 , 100.00, 1
# target 50% 0.0071
# target 75% 0.01
# target 90% 0.018
# target 99% 0.05
# target 99.9% 0.0502085
Sockets used: 5 (for perfect keepalive, would be 5)
Jitter: false
Code 200 : 100 (100.0 %)
Response Header Sizes : count 100 avg 266.16 +/- 0.3666 min 266 max 267 sum 26616
Response Body/Total Sizes : count 100 avg 268.16 +/- 0.3666 min 268 max 269 sum 26816
All done 100 calls (plus 0 warmup) 9.623 ms avg, 503.1 qps
```

----

### 2. Configure the service to use circuit breaking and bulkheading
Run the following to apply a dynamic update to our DestinationRules:

`oc apply -f circuitbreaker-boards.yaml`

The following rule sets a TCP/HTTP connection pool size of 2 connections and allows 1 concurrent HTTP requests, with no more than 2 req/connection to each `boards` service instance.

```yaml
connectionPool:
  tcp:
    maxConnections: 2
  http:
    http2MaxRequests: 3
    http1MaxPendingRequests: 3
    maxRequestsPerConnection: 2
```

We also configured another rule to scan every 30 seconds. And any request that fails 1 consecutive times with 5XX error code will force the faulty host pod to be ejected from the load balancer pool for 5 minutes.

```yaml
outlierDetection:
  consecutiveErrors: 1
  interval: 30s
  baseEjectionTime: 5m
  maxEjectionPercent: 100
```
----

### 3. Fill the bulkhead
Now that we applied the pattern, let's run the same command as before and fill up a connection pool (bulkhead):

`oc run web-load --attach --rm --restart=Never --image=istio/fortio -- load -c 5 -qps 0 -n 100 -loglevel Warning http://boards:8080/shareditems`

The result should look like:
```
03:31:34 I logger.go:97> Log level is now 3 Warning (was 2 Info)
Fortio 1.3.2-pre running at 0 queries per second, 2->2 procs, for 100 calls: http://boards:8080/shareditems 
Starting at max qps with 5 thread(s) [gomax 2] for exactly 100 calls (20 per thread + 0)
03:31:34 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:34 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:34 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:34 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
03:31:35 W http_client.go:695> Parsed non ok code 503 (HTTP/1.1 503)
Ended after 441.694225ms : 100 calls. qps=226.4
Aggregated Function Time : count 100 avg 0.017947649 +/- 0.01656 min 0.000551304 max 0.062214398 sum 1.79476485
# range, mid point, percentile, count
>= 0.000551304 <= 0.001 , 0.000775652 , 2.00, 2
> 0.001 <= 0.002 , 0.0015 , 16.00, 14
> 0.002 <= 0.003 , 0.0025 , 17.00, 1
> 0.003 <= 0.004 , 0.0035 , 19.00, 2
> 0.005 <= 0.006 , 0.0055 , 24.00, 5
> 0.006 <= 0.007 , 0.0065 , 31.00, 7
> 0.007 <= 0.008 , 0.0075 , 34.00, 3
> 0.008 <= 0.009 , 0.0085 , 42.00, 8
> 0.009 <= 0.01 , 0.0095 , 43.00, 1
> 0.01 <= 0.011 , 0.0105 , 44.00, 1
> 0.011 <= 0.012 , 0.0115 , 46.00, 2
> 0.012 <= 0.014 , 0.013 , 54.00, 8
> 0.014 <= 0.016 , 0.015 , 61.00, 7
> 0.016 <= 0.018 , 0.017 , 63.00, 2
> 0.018 <= 0.02 , 0.019 , 67.00, 4
> 0.02 <= 0.025 , 0.0225 , 76.00, 9
> 0.025 <= 0.03 , 0.0275 , 80.00, 4
> 0.03 <= 0.035 , 0.0325 , 85.00, 5
> 0.035 <= 0.04 , 0.0375 , 87.00, 2
> 0.045 <= 0.05 , 0.0475 , 92.00, 5
> 0.05 <= 0.06 , 0.055 , 98.00, 6
> 0.06 <= 0.0622144 , 0.0611072 , 100.00, 2
# target 50% 0.013
# target 75% 0.0244444
# target 90% 0.048
# target 99% 0.0611072
# target 99.9% 0.0621037
Sockets used: 19 (for perfect keepalive, would be 5)
Jitter: false
Code 200 : 86 (86.0 %)
Code 503 : 14 (14.0 %)
Response Header Sizes : count 100 avg 229.26 +/- 92.5 min 0 max 267 sum 22926
Response Body/Total Sizes : count 100 avg 273.54 +/- 12.3 min 268 max 304 sum 27354
All done 100 calls (plus 0 warmup) 17.948 ms avg, 226.4 qps
```

**See that Istio immediately returns 503 on the filled bulkhead**

*Note, that if you scaled up the boards service by a couple more pods the bulkhead wouldn't fill - it's per pod.*

----

### 4. Break the app and Trip the breaker
Now let's try to trip the circuit breaker by temporarily faking some errors into the boards service. Run this:

`oc apply -f faulty-boards-service.yaml`

Istio is now creating some faults for us to help test delays and fake some service failures.

TODO - Steps to showcase demo of outlier detection for circuit breaking...

The result should look like:
```
TODO
```
**See that Istio immediately returns 503 on the tripped breaker vs. waiting for each call to fail after waiting for a long timeout**

----

## That's it!
The basic circuit breaker and bulkhead patterns can be useful when operating a microservices based application. Istio has the basic capability for both of these patterns. It's language independent and you can configure the capability at runtime without any code changes.

Read more about these capabilities in Istio [here][3] and check out the [configuration reference here][4].

[1]: https://martinfowler.com/bliki/CircuitBreaker.html
[2]: https://landing.google.com/sre/sre-book/chapters/addressing-cascading-failures/
[3]: https://istio.io/docs/tasks/traffic-management/circuit-breaking/
[4]: https://istio.io/docs/reference/config/networking/v1alpha3/destination-rule/