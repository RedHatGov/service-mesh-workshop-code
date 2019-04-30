# OpenShift configuration
The files in here configure the OpenShift and Kubernetes resources for microservices demo app.


## Using the files
These files are used by the install script located at [../services-install.sh](../services-install.sh).
Or you can manually install the services by using `oc apply -f FILE`.

(The files postfixed with `-fromsource` build+deploy vs. just deploy known container versions)

(Prebuilt containers used for this demo are [coming from quay.io][1])


## Once it's up an running your application view should look like this
<img src="./screenshot-ocp-overview.png" width="400">

(This is the basic minimal deployment of the application - you might have more services if you install everything)


## Verify the services are healthy
You can get basic health checking for liveliness and readiness from OpenShift by... TODO write up + screenshots here.

You can get additional insight if you're using Istio by... TODO write up + screenshots here.


[1]: https://quay.io/user/jasonredhat