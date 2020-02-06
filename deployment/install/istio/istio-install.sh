#!/bin/bash
# INSTALL OPERATOR
oc apply -f ./istio-operator.yaml

# CHECK OPERATOR WAS INSTALLED
oc get pods -n openshift-operators -l name=istio-operator

# DEPLOY THE ISTIO CONTROL PLANE AND COMPONENTS
oc new-project istio-system
oc create -n istio-system -f ./istio-resources.yaml

# CHECK THE INSTALL COMPLETED
oc get servicemeshcontrolplane/istio-demo -n istio-system --template='{{range .status.conditions}}{{printf "%s=%s, reason=%s, message=%s\n\n" .type .status .reason .message}}{{end}}'

# IF YOU NEED TO REMOVE AN ISTIO INSTALL AND COMPONENTS
#oc delete -n istio-system servicemeshcontrolplane istio-demo
#oc delete project istio-system

# IF YOU WANT TO DELETE THE ISTIO OPERATOR TOO
#oc delete -f ./istio-operator.yaml
