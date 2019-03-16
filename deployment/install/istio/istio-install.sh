oc new-project istio-operator
oc new-app -f istio-operator.yaml --param=OPENSHIFT_ISTIO_MASTER_PUBLIC_URL=https://yourcluster.com

# WAIT UNTIL THINGS ARE READY
# oc logs -n istio-operator $(oc -n istio-operator get pods -l name=istio-operator --output=jsonpath={.items..metadata.name})

oc create -f istio-resources.yaml -n istio-operator

# WAIT AND WATCH
# oc get pods -n istio-system -w