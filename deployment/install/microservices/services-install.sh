#!/bin/bash
oc new-project microservices-demo --display-name="OpenShift Microservices Demo"
oc project microservices-demo

# RELAX SCCs FOR ISTIO
# For each identified service account you must update the cluster configuration to ensure they are granted 
# access to the anyuid and privileged SCCs by executing the following commands from an account with cluster 
# admin privileges. Replace <service account> and <namespace> with values specific to your application.
# oc adm policy add-scc-to-user anyuid -z <service account> -n <namespace>
# oc adm policy add-scc-to-user privileged -z <service account> -n <namespace>
# Details on why are here:
# https://docs.openshift.com/container-platform/3.11/servicemesh-install/servicemesh-install.html#configuring-security-constraints-for-application-service-accounts
oc adm policy add-scc-to-user anyuid -z default -n microservices-demo
oc adm policy add-scc-to-user privileged -z default -n microservices-demo

# PULL THE CONTAINERS, CREATE THE SERVICES, PODS, ETC (NOTE YOU CAN TWEAK THESE WITH PARAMS '-p XXX=XXX')
oc new-app -f ./openshift-configuration/boards.yaml
oc new-app -f ./openshift-configuration/context-scraper.yaml
oc new-app -f ./openshift-configuration/app-ui.yaml
#oc new-app -f ./openshift-configuration/auth-sso73-x509.yaml
#oc new-app -f ./openshift-configuration/userprofile.yaml

# CREATE A CUSTOM ROUTE FOR THE ISTIO INGRESS ROUTER (IF USING ISTIO)
APPS_DOMAIN=$(oc get route istio-ingressgateway -n istio-system --template={{.spec.host}} | cut -f2-100 -d".")
oc expose service istio-ingressgateway --name=microservices-demo-route --hostname=microservices.${APPS_DOMAIN} -n istio-system
oc expose service istio-ingressgateway --name=microservices-demo-debug-route --hostname=debug-microservices.${APPS_DOMAIN} -n istio-system

# APPLY ISTIO CONFIG (IF USING ISTIO)
oc apply -f ./istio-configuration/ingress-gateway.yaml
oc apply -f ./istio-configuration/egress-serviceentry.yaml
oc apply -f ./istio-configuration/policy-default-disablemtls.yaml
oc apply -f ./istio-configuration/destinationrules.yaml
oc apply -f ./istio-configuration/virtual-services.yaml

# Using this virtual service with the debug OpenShift route into
# the istio ingressrouter so I we can expose some internal services for
# debugging/demos - don't create this in production
# oc apply -f - <<EOF
# apiVersion: networking.istio.io/v1alpha3
# kind: VirtualService
# metadata:
#   name: microservices-demo-debug
# spec:
#   hosts:
#   - debug-microservices.${APPS_DOMAIN}
#   gateways:
#   - microservices-demo-gateway
#   http:
#   - route:
#     - destination:
#         host: context-scraper
#         port:
#           number: 8080
# EOF
