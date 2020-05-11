#!/bin/sh
for (( i=1 ; i <= $NUM_USERS ; i++ ))
do
  oc apply -f - <<EOF
apiVersion: operators.coreos.com/v1
kind: OperatorGroup
metadata:
  name: user${i}-asdf
  namespace: user$i
spec:
  targetNamespaces:
  - user$i
EOF

  oc apply -f -<<EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: keycloak-operator
  namespace: user$i
spec:
  channel: alpha
  Install Plan Approval: Automatic
  name: keycloak-operator
  source: community-operators
  sourceNamespace: openshift-marketplace
  Starting CSV: keycloak-operator.v9.0.2
EOF

done
