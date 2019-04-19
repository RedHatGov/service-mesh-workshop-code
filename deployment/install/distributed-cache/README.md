# Distributed cache setup

# THIS IS CURRENTLY NOT WORKING... NEED TO DEBUG

## Prerequisites (OLM and Infinispan/Redis Operator)
** Note **
    In order to install an Operator from OperatorHub.io, first be sure that you have a Kubernetes cluster (v1.7 or newer) running with
    privileges to create new namespaces, ClusterRoles, ClusterRoleBindings and CustomResourceDefinitions. The Operator Lifecycle 
    Manager (OLM), a component of the Operator Framework, must also be present in your cluster. OLM makes Operators available for 
    users to install based on the concept of catalogs which are repositories of Operators packaged for use with OLM. 

If you don't already have the OLM follow [these instructions][2]:
```create -f https://raw.githubusercontent.com/operator-framework/operator-lifecycle-manager/master/deploy/upstream/quickstart/olm.yaml```
    
(in 3.11 you might get an error about ```no matches for kind``` - if so, wait a few seconds and run the above command again)

With OLM available (if you haven't already) install the redis operator ([reference][2]):
```oc project operators```
```oc create -f https://operatorhub.io/install/redis-enterprise-operator.v0.0.1.yaml```

More details on the [redis operator can be found here][3].

## Install
We can create a cache cluster for this app by telling an operator to do it using the config file in this folder:
```oc project microservices-demo```
```oc apply -f redis-enterprise-cluster_rhel.yaml```

[1]: https://operatorhub.io/operator/redis-enterprise-operator.v0.0.1
[2]: https://operatorhub.io/how-to-install-an-operator#How-do-I-get-Operator-Lifecycle-Manager?
[3]: https://github.com/RedisLabs/redis-enterprise-k8s-docs
