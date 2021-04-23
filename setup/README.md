## Setup

Run the following as cluster admin.

### Users and Projects

Set the number of users:
```bash
export NUM_USERS=5  # replace me
```

Create two projects for each user (user project and user's service mesh project):

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  oc new-project user$i --as=user$i \
    --as-group=system:authenticated --as-group=system:authenticated:oauth
  oc new-project user$i-istio --as=user$i \
    --as-group=system:authenticated --as-group=system:authenticated:oauth
done
```

Delete limit ranges in each user project:
> Note: This is only for RHPDS clusters

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  oc delete limitrange --all -n user$i-istio
done
```

### Service Mesh

Install the service mesh operators:

```bash
oc create -f ./setup/istio-operators.yaml
```

Wait until all the operators are running:

```bash
oc get pods -n openshift-operators --watch
```

Install the Red Hat SSO operator for each user:
> Note: We have to install the operator individually in each project because the operator cannot be installed in `all namespaces` mode.

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  sed "s|%USER_PROJECT%|user$i|" ./setup/rhsso-operator.yaml | oc create -n user$i -f -
done
```

Create service mesh control plane in each user's service mesh project:

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  oc create -n user$i-istio -f ./setup/istio-installation.yaml
done
```

Wait until the control plane is running:

```bash
oc get pods -n user$NUM_USERS-istio --watch
```

Add each user project as a member to its corresponding service mesh project:

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  sed "s|%USER_PROJECT%|user$i|" ./setup/istio-smmr.yaml | oc create -n user$i-istio -f -
done
```

Label the `openshift-ingress` namespace:
> Note: Service mesh blocks route traffic so we need to add this label for the RH-SSO route

```bash
oc label namespaces openshift-ingress network.openshift.io/policy-group=ingress
```

### Patch Kiali Config Map
The current Kiali defaults don't show `DeploymentConfig`'s in the UI so we need to tweak the config map. 

```bash
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do
  oc get cm kiali -n user$i-istio -o yaml | sed '/DeploymentConfig/d' | oc apply -n user$i-istio -f -
  oc rollout restart deployment kiali -n user$-istio
done
```