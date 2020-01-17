#modify variables
POSTGRESQL_USER=sarah
POSTGRESQL_PASSWORD=connor
POSTGRESQL_DATABASE=userprofiledb
POSTGRESQL_SERVICE_HOST=userprofile-postgresql


USER_PROFILE_GIT_REPO=https://github.com/gbengataylor/openshift-microservices
USER_PROFILE_GIT_BRANCH=moving-to-four 
USER_PROFILE_OCP_PROJECT=user-profile-gbenga

oc new-project $USER_PROFILE_OCP_PROJECT

# you can substitute postgresql-ephemeral if you need an ephemeral db
oc new-app --template=postgresql-persistent --name=userprofile-postgresql -lapp=userprofile -luserprofile-component=db --param=POSTGRESQL_USER=$POSTGRESQL_USER --param=POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD --param=POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE --param=DATABASE_SERVICE_NAME=$POSTGRESQL_SERVICE_HOST
      
echo 'Wait for postgresql to deploy ..'

until 
	oc get pods -lapp=userprofile-postgresql | grep "userprofile-postgresql" | grep -m 1 "1/1"
do
	sleep 2
done


# this can be improved to use the generated secret from postgressql deploy. for now just use env variable
QUARKUS_NATIVE_IMAGE_VERSION=19.2.1
oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:${QUARKUS_NATIVE_IMAGE_VERSION}~${USER_PROFILE_GIT_REPO}#${USER_PROFILE_GIT_BRANCH}  \
 --context-dir=/code/userprofile --name=userprofile -luserprofile-component=microservice \
 --env POSTGRESQL_USER=$POSTGRESQL_USER \
 --env POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
 --env POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \
 --env POSTGRESQL_SERVICE_HOST=$POSTGRESQL_SERVICE_HOST 

oc expose service userprofile

echo 'Wait for build to complete ..'

until 
 oc get builds -lapp=userprofile | grep Complete 
do
	sleep 20
done 

echo 'Deploying user-profile pod ..'

until 
	oc get pods -l deploymentconfig=userprofile | grep -m 1 "1/1"
do
	sleep 5
done 


# delete
# oc delete all -lapp=userprofile
# oc delete all,secret -lapp=userprofile-postgresql

#clean pvc, secret
# oc delete pvc userprofile-postgresql
# oc delete secret userprofile-postgresql
