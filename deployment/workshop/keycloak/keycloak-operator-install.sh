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
  installPlanApproval: Manual
  name: keycloak-operator
  source: community-operators
  sourceNamespace: openshift-marketplace
  startingCSV: keycloak-operator.v9.0.2
EOF

done

sleep 5

for (( i=1 ; i <= $NUM_USERS ; i++ ))
do
  oc patch ip $(oc get ip -n user${i} -o jsonpath={.items[0].metadata.name}) -n user${i} --type merge -p '{"spec":{"approved":true}}'
done