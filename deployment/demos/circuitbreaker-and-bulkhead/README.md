# Circuit Breakers and Bulkheads
When implementing microservices you now have many individual services required to complete a part of the app’s overall functionality. Any of these services can fail individually. And that failure could be permanent or just temporary.

Obviously, calling code should be prepared to handle failures, but sometimes failure isn’t instantaneous (e.g. 15 sec before you get an error response). Cascading failures are even worse as they are failures that happen as part of a chain of many microservice interactions. The last service in a chain of calls could fail rendering that whole path a failure.

As an example: imagine a pinterest type service where we can upload photos. But something is wrong with the upload service. Do you tell the user the app is broken and say - “sorry nothing works?” I hope not, the code could/should still allow users to view, comment, and use the app otherwise. But you’ve got this long timeout that locks up the app every time they try uploading. That’s bad. Configuring static timeouts is an anti-pattern (it’s almost impossible to come up with the right numbers for that). You need another solution... 

Let's take a look at implementing circuit breaking and bulkheads to help with handling partial outages and cascading failures.

## About Circuit Breaking
TODO

## About Bulkheads
TODO

## Demo Steps
This demo shows how Istio can be used to add circuit breaking and bulkheading capabilities to services into our app.

### Verify we aren't circuit breaking
We can use OpenShfit to pull a container image containing Apache Benchmark (aka "ab") and run it as self-terminating like this:

`oc run web-load --rm --attach --image=jordi/ab -- -n 50000 -c 10 boards`

The result should look like:
```
TODO
```

### Configure the service to use circuit breaking and bulkheading
Run the following to apply a dynamic update to the DestinationRule for the boards service:
`oc apply -f ./circuitbreaker-boards.yaml`

### Trip the breaker
Now let's try to trip the circuit break by running this:

`oc run web-load --rm --attach --image=jordi/ab -- -n 50000 -c 10 boards`


### Fill the bulkhead
And let's try to fill up a bulkhead by running this:

`oc run web-load --rm --attach --image=jordi/ab -- -n 50000 -c 10 boards`

## Summary
Using the ... TODO