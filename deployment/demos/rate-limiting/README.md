# Rate Limiting
Traffic spikes are unpredictable increased load on your application. This could come from user demand or malicious attacks. And these spikes can be especially hard on specific services. In particular, services that have limited resources and can't just scale up to handle the increased demand. One solution is to leverage API gateways for regulating application access. But API gateways are typically only running at the ingress point of your cluster. And in some cases that's like performing surgery with a sword. Another option is to leverage rate limiting on individual services using Istio. Let's take a look at how to do that.

## Demo Steps
TODO

### Verify we aren't already rate lmited
TODO

### Configure the service
Run the following to apply a dynamic update to create policy and apply it to the boards service:
`oc apply -f ./ratelimiting-boards.yaml`

## Summary
Using [rate limiting][1] ... TODO

[1]: https://istio.io/docs/tasks/policy-enforcement/rate-limiting/