export THREE_SCALE_GATEWAY_PROJ=shared-apimgmt
export APICAST_TEMPLATE=https://raw.githubusercontent.com/3scale/3scale-amp-openshift-templates/2.4.0.GA/apicast-gateway/apicast.yml
# ENTER THE NAME OF YOUR 3SCALE SaaS TENANT
export SAAS_TENANT_NAME=
# BY DEFAULT USE 3SCALE.NET, BUT THIS CAN BE ANY 3SCALE MANAGER
export 3SCALE_ADMIN_LOCATION=admin.3scale.net
# Get the Access Token from Settings Widget->Personal->Tokens
# You can add a new one with the appropriate permissions
export ACCESS_TOKEN=
export APICAST_NAME=apicast

#OPENSHIFT WILDCARD DOMAIN
export  OCP_ROUTE=apps.sulu.nub3s.io
export WILDCARD_DOMAIN=$THREE_SCALE_GATEWAY_PROJ.$OCP_ROUTE

oc new-project $THREE_SCALE_GATEWAY_PROJ

# # Test to ensure the URL is correct
curl -k -i https://${ACCESS_TOKEN}@${SAAS_TENANT_NAME}-${3SCALE_ADMIN_LOCATION}/admin/api/services.json || grep -m 1 "200 OK" || (echo "Access Token Failed" && exit)

oc create secret generic apicast-configuration-url-secret --from-literal=password=https://${ACCESS_TOKEN}@${SAAS_TENANT_NAME}-${3SCALE_ADMIN_LOCATION}  --type=kubernetes.io/basic-auth

oc new-app -f $APICAST_TEMPLATE -p LOG_LEVEL=debug --param APICAST_NAME=$APICAST_NAME


until 
	oc get pods | grep $APICAST_NAME | grep -m 1 "1/1"
do
	sleep 2
done

echo "API Gateway installed. Manually create routes for each API or create a wildcard route"

# IF YOU HAVE CLUSTER ADMIN TO SET WILDCARD ROUTE, UNCOMMENT THE COMMANDS BELOW
# # UPDATE THE ROUTER TO ALLOW WILDCARD ROUTES

# oc adm router --replicas=0 -n default
# oc set env dc/router ROUTER_ALLOW_WILDCARD_ROUTES=true -n default
# oc scale dc/router --replicas=1 -n default

# #   ENSURE THE ROUTER IS RUNNING

# until 
# 	oc get pods -n default| grep "router" | grep -m 1 "1/1"
# do
# 	sleep 2
# done

# # Create wildcard route for api gateway from the template
# envsubst < gateway-wildcard-route.yaml.t2 | oc create -f-
