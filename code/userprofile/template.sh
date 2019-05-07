#modify variables
POSTGRESQL_SERVICE_HOST=userprofile-postgresql
USER_PROFILE_GIT_REPO=https://github.com/gbengataylor/openshift-microservices
USER_PROFILE_GIT_BRANCH=develop 
QUARKUS_VERSION_TAG=graalvm-1.0.0-rc15
APPLICATION_IMAGE_URI=quay.io/gbengataylor/openshift-microservices-userprofile

#s2i -- build and deploy from source
#using specific version of s2i as latest (rc16 wasn't working)
oc new-app -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml -p QUARKUS_VERSION_TAG=${QUARKUS_VERSION_TAG} -p GIT_URI=${USER_PROFILE_GIT_REPO}  -p GIT_BRANCH=${USER_PROFILE_GIT_BRANCH} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST}

# deploy using image
#oc new-app -f  ../../deployment/install/microservices/openshift-configuration/userprofile.yaml -p APPLICATION_IMAGE_URI=${APPLICATION_IMAGE_URI} -p DATABASE_SERVICE_NAME=${POSTGRESQL_SERVICE_HOST}

# delete everything
# oc delete -f ../../deployment/install/microservices/openshift-configuration/userprofile-fromsource.yaml
# oc delete all,secrets,pvc -lapp=userprofile
#delete everything but data
# oc delete all,secrets -lapp=userprofile


#to delete data
#oc delete pvc -lapp=userprofile