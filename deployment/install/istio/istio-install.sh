oc new-project istio-operator
oc new-app -f istio-install.yaml --param=OPENSHIFT_ISTIO_MASTER_PUBLIC_URL=https://yourcluster.com