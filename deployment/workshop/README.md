# OpenShift Service Mesh Workshop

Clone this repo to get started:
```
git clone https://github.com/RedHatGov/openshift-microservices.git
```

Checkout the workshop-stable branch:
```
git checkout workshop-stable
```

Navigate to the workshop directory:
```
cd openshift-microservices/deployment/workshop/
```

## Install Istio
Start by installing the Istio [Operator][1].  The operator is used to install and manage Istio in the cluster.
```
oc create -f ./istio-install/istio-operator.yaml
```

Watch the operator installation:
```
oc get pods -n openshift-operators -l name=istio-operator --watch
```

The Istio operator should be in a running state.  For example:
```
istio-operator-xxxxxxxxx-xxxxx   1/1   Running   0     17s
```

Once the operator is running, install the Istio control plane in its own namespace `istio-system`:
```
oc new-project istio-system
oc create -n istio-system -f ./istio-install/istio-resources.yaml
```

Watch the control plane installation:
```
oc get servicemeshcontrolplane/istio-demo -n istio-system --template='{{range .status.conditions}}{{printf "%s=%s, reason=%s, message=%s\n\n" .type .status .reason .message}}{{end}}' --watch
```

Wait a couple of minutes.  The installation should complete.  For example:

```
Installed=True, reason=InstallSuccessful, message=Successfully installed all mesh components

Reconciled=True, reason=InstallSuccessful, message=Successfully installed version 1.0.6-1.el8-1

Ready=True, reason=ComponentsReady, message=All component deployments are Available

```

List all the Istio components:
```
oc get pods -n istio-system
```

Output:

```
NAME                                      READY   STATUS    RESTARTS   AGE
grafana-xxxxxxxxx-xxxxx                   2/2     Running   0          17m
istio-citadel-xxxxxxxxx-xxxxx             1/1     Running   0          20m
istio-egressgateway-xxxxxxxx-xxxxx        1/1     Running   0          17m
istio-galley-xxxxxxxx-xxxxx               1/1     Running   0          19m
istio-ingressgateway-xxxxxxxxx-xxxxx      1/1     Running   0          17m
istio-pilot-xxxxxxxxx-xxxxx               2/2     Running   0          18m
istio-policy-xxxxxxxxx-xxxxx              2/2     Running   0          19m
istio-sidecar-injector-xxxxxxxxx-xxxxx    1/1     Running   0          17m
istio-telemetry-xxxxxxxxx-xxxxx           2/2     Running   0          19m
jaeger-xxxxxxxxx-xxxxx                    2/2     Running   0          19m
kiali-xxxxxxxxx-xxxxx                     1/1     Running   0          16m
prometheus-xxxxxxxxx-xxxxx                2/2     Running   0          19m
```

## Setup Users and Projects

Create a group for the workshop:
```
oc adm groups new workshop
```

Create the following role and role bindings:
```
oc create -f ./istio-configuration/istio-rbac.yaml
```

Set the number of users:
```
NUM_USERS=<enter number of users>
```

Then run the following:
```
for (( i=1 ; i<=$NUM_USERS ; i++ ))
do 
  oc adm groups add-users workshop user$i
  oc new-project user$i --as=user$i \
    --as-group=system:authenticated --as-group=system:authenticated:oauth
  oc process -f ./istio-configuration/ingress-loadbalancer.yaml \
  -p INGRESS_GATEWAY_NAME=demogateway-user$i | oc create -n user$i -f -
done
```

Next, add projects to the service mesh using a [Member Roll][2] resource.  If you do not add the projects to the mesh, the users' microservices will not be added to the service mesh.

Add projects to the mesh (adjust the number of user projects as needed):
```
oc create -f - <<EOF
apiVersion: maistra.io/v1
kind: ServiceMeshMemberRoll
metadata:
  name: default
  namespace: istio-system
spec:
  members:
    - user1
    - user2
    - user3
    - user4
    - user5
    - user6
    - user7
    - user8
    - user9
    - user10
    - user11
    - user12
    - user13
    - user14
    - user15
    - user16
    - user17
    - user18
    - user19
    - user20
EOF
```
### Patch Kiali Config Map
The current Kiali defaults don't show `DeploymentConfig`'s in the UI so we need to tweak the config map. You can do that by:
* `oc edit cm/kiali -n istio-system`
* search for "excluded_workloads" and remove DeploymentConfig from the list
* restart the Kaili pod: `oc rollout restart deployment kiali -n istio-system`

### Install the Keycloak Operator
We have each student install Keycloak as part of a security lab but you need to provide the operator to them:

* As admin, Goto the OpenShift webconsole and Operators > OperatorHub
* Filter by keyword "Keycloak" and you should see a community operator show up - Click it.
* The details will slide in from the right. Note the version and see that it matches the version in the file `keycloak/keycloak-operator-install.sh`
* Install for every user project using the following script
```
   sh keycloak/keycloak-operator-install.sh
```
* Wait until everything finishes and the operator is running


[1]: https://www.openshift.com/learn/topics/operators
[2]: https://docs.openshift.com/container-platform/4.1/service_mesh/service_mesh_install/installing-ossm.html#ossm-member-roll_installing-ossm
