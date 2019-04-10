THREE_SCALE_PROJ=shared-apimgmt
AMP_TEMPLATE=https://raw.githubusercontent.com/3scale/3scale-amp-openshift-templates/2.4.0.GA/amp/amp.yml
OCP_ROUTE=apps.sulu.nub3s.io
WILDCARD_DOMAIN=$THREE_SCALE_PROJ.$OCP_ROUTE
TENANT_NAME=shared-apimgmt
ADMIN_PASSWORD=admin

# UPDATE THE ROUTER TO ALLOW WILDCARD ROUTES
oc adm router --replicas=0 -n default
oc set env dc/router ROUTER_ALLOW_WILDCARD_ROUTES=true -n default
oc scale dc/router --replicas=1 -n default

#  ENSURE THE ROUTER IS RUNNING
until 
	oc get pods -n default| grep "router" | grep -m 1 "1/1"
do
	sleep 2
done

# DEPLOY 3SCALE
oc new-project $THREE_SCALE_PROJ
oc new-app --file $AMP_TEMPLATE --param WILDCARD_DOMAIN=$WILDCARD_DOMAIN --param WILDCARD_POLICY=Subdomain --param ADMIN_PASSWORD=$ADMIN_PASSWORD --param TENANT_NAME=$TENANT_NAME


# IF YOU DON'T HAVE PERMISSION TO ALLOW WILDCARD ROUTES, RUN THIS INSTEAD
# YOU WILL NEED TO MANUALLY CREATE ROUTES FOR EVERY API THAT 3SCALE MANAGES
# oc new-app --file $AMP_TEMPLATE --param WILDCARD_DOMAIN=$WILDCARD_DOMAIN --param ADMIN_PASSWORD=$ADMIN_PASSWORD --param TENANT_NAME=$TENANT_NAME

# TO DELETE
# oc delete all --all -n $THREE_SCALE_PROJ
# oc delete project $THREE_SCALE_PROJ

#TODO
# AUTOMATICALLY LOAD THE API to 3scale- API-as-code? 3scale-cli?

