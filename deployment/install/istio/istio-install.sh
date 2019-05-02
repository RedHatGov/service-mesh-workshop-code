#!/bin/bash
oc new-project istio-operator
oc new-project istio-system
oc apply -n istio-operator -f ./istio-operator.yaml

# CHECK OPERATOR WAS INSTALLED
oc get pods -n istio-operator -l name=istio-operator

# DEPLOY THE ISTIO CONTROL PLANE AND COMPONENTS
oc create -n istio-system -f ./istio-resources.yaml

# CHECK THE INSTALL COMPLETED
# oc get controlplane/istio-demo -n istio-system --template='{{range .status.conditions}}{{printf "%s=%s, reason=%s, message=%s\n\n" .type .status .reason .message}}{{end}}'

# IF YOU NEED TO REMOVE AN ISTIO INSTALL AND COMPONENTS
#oc delete -n istio-system controlplane istio-demo

# IF YOU WANT TO DELETE THE ISTIO OPERATOR TOO
#oc delete -n istio-operator -f ./istio-operator.yaml
#oc delete project istio-system
#oc delete project istio-operator