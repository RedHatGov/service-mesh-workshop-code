#TODO
# when generating the templage
# the app can then pull those  env variables from the secret generated
# generated secret name is userprofile-postgresql
# entries are database-user, database-password, database-name

#modify variables
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
USER_PROFILE_GIT_REPO=https://github.com/gbengataylor/openshift-microservices
USER_PROFILE_GIT_BRANCH=develop 
#USER_PROFILE_OCP_PROJECT=user-profile-gbenga
# TODO: update the new-app command to use the generated secret and it's associated entries when using template
#using specific version of s2i as latest (rc16 wasn't working)

oc new-app -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml -p QUARKUS_VERSION_TAG='graalvm-1.0.0-rc15' -p GIT_URI=${USER_PROFILE_GIT_REPO}  -p GIT_BRANCH=${USER_PROFILE_GIT_BRANCH} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST}

# delete everything
# oc delete -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml

#delete everything but data
# oc delete all -lapp=userprofile
# oc delete secrets -lapp=userprofile

#to delete data
#oc delete pvc -lapp=userprofile