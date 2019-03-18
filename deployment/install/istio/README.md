# Istio setup
The latest guide can be found here:
[https://docs.openshift.com/container-platform/3.11/servicemesh-install/servicemesh-install.html](1).

The simple version is:
1) Make sure each node in your cluster has enough [virtual mem for Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html) --> `sysctl -w vm.max_map_count=262144`
2) Tweak the config files in this folder to add your user/pass info and set the cluster URL
   1) `istio-resources.yaml`
   2) `istio-install.sh`
3) Make sure you are `oc login`-ed as a cluster admin
4) Run ./istio-install.sh

## Automatic sidecar injection
Please make sure your OpenShift cluster is enabled for this by following these instructions:
https://docs.openshift.com/container-platform/3.11/servicemesh-install/servicemesh-install.html#updating-master-configuration


Note: I keep a copy of required yaml in this repo, but [you can get the latest here](2).

[1]: https://docs.openshift.com/container-platform/3.11/servicemesh-install/servicemesh-install.html
[2]: https://github.com/Maistra/openshift-ansible/tree/maistra-0.8/istio

