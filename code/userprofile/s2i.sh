# postgres deployment
# use POSTGRESQL_USER
# POSTGRESQL_PASSWORD
# POSTGRESQL_DATABASE
# POSTGRESQL_SERVICE_HOST
# POSTGRESQL_SERVICE_PORT
# when generating the templage
# the app can then pull those  env variables from the secret generated
# generated secret name is userprofile-postgresql
# entries are database-user, database-password, database-name

#modify variables
POSTGRESQL_USER=sarah
POSTGRESQL_PASSWORD=connor
POSTGRESQL_DATABASE=userprofiledb
POSTGRESQL_SERVICE_HOST=userprofile-postgresql


USER_PROFILE_GIT_REPO=https://github.com/gbengataylor/openshift-microservices
USER_PROFILE_GIT_BRANCH=develop 
USER_PROFILE_OCP_PROJECT=user-profile-gbenga

oc new-project $USER_PROFILE_OCP_PROJECT

# you can substitute postgresql-ephemeral if you need an ephemeral db
oc new-app --template=postgresql-persistent --name=userprofile-postgresql \
    --param=POSTGRESQL_USER=$POSTGRESQL_USER \
    --param=POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
     --param=POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \ 
     --param=DATABASE_SERVICE_NAME=$POSTGRESQL_SERVICE_HOST \
      -lapp=userprofile -luserprofile-component=db

echo 'Wait for postgresql to deploy ..'

until 
	oc get pods -lapp=userprofile-postgresql | grep "userprofile-postgresql" | grep -m 1 "1/1"
do
	sleep 2
done

# image
# TODO: update the new-app command to use the generated secret and it's associated entries when using template
oc new-app quay.io/quarkus/centos-quarkus-native-s2i~${USER_PROFILE_GIT_REPO}#${USER_PROFILE_GIT_BRANCH}  \
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

#openjdk - won't work
#oc new-app java~https://github.com/gbengataylor/openshift-microservices#develop --context-dir=/code/userprofile --name=userprofile-jdk

# delete
# oc delete all -lapp=userprofile
# oc delete all -lapp=userprofile-postgresql
# oc delete secret userprofile-postgresql
#clean pvc
# oc delete pvc userprofile-postgresql

#TODO: create a template for both db and app?
