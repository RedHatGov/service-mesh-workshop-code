THREE_SCALE_GATEWAY_PROJ=3scale-demo-gateway
APICAST_TEMPLATE=https://raw.githubusercontent.com/3scale/3scale-amp-openshift-templates/2.4.0.GA/apicast-gateway/apicast.yml
# ENTER THE NAME OF YOUR 3SCALE SaaS TENANT
SAAS_TENANT_NAME=
# Get the Access Token from Settings Widget->Personal->Tokens
# You can add a new one with the appropriate permissions
ACCESS_TOKEN=

oc new-project $THREE_SCALE_GATEWAY_PROJ

# Test to ensure the URL is correct
curl -k -i https://${ACCESS_TOKEN}@${SAAS_TENANT_NAME}-admin.3scale.net/admin/api/services.json | grep -m 1 "200 OK" || (echo "Access Token Failed" && exit)

oc secret new-basicauth apicast-configuration-url-secret --password=https://${ACCESS_TOKEN}@${SASS_TENANT_NAME}-admin.3scale.net

oc new-app -f $APICAST_TEMPLATE -p LOG_LEVEL=debug

# TODO - is Wildcard router possible for self-managed APICAST?
