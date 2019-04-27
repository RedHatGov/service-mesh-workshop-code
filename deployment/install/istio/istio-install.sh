#!/bin/bash
oc new-project istio-operator
oc new-app -f istio-operator.yaml --param=OPENSHIFT_ISTIO_MASTER_PUBLIC_URL=https://yourcluster.com:443

# CHECK OPERATOR WAS INSTALLED
oc logs -n istio-operator $(oc -n istio-operator get pods -l name=istio-operator --output=jsonpath={.items..metadata.name})

# DEPLOY THE CONTROL PLANE
oc create -f istio-resources.yaml -n istio-operator

# CHECK THE INSTALL COMPLETED
until 
	oc get pods -n istio-system | grep "openshift-ansible-istio" | grep -m 1 "Completed"
do
	oc get pods -n istio-system | grep "openshift-ansible-istio"
	sleep 2
done

# IF YOU NEED TO REMOVE ISTIO AND COMPONENTS
# oc delete -n istio-operator installation istio-installation
# oc process -f istio-operator.yaml | oc delete -f -