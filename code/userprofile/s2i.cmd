# postgres deployment
# use POSTGRESQL_USER
# POSTGRESQL_PASSWORD
# POSTGRESQL_DATABASE
# when generating the templage
# the app can then pull those  env variables from the secret generated
# generated secret name is userprofile-postgresql
# entries are database-user, database-password, database-name

USER_PROFILE_GIT_REPO=https://github.com/gbengataylor/openshift-microservices
USER_PROFILE_GIT_BRANCH=develop 

# you can substitute postgresql-ephemeral if you need an ephemeral db
oc new-app --template=postgresql-persistent --name=userprofile-postgresql --param=POSTGRESQL_USER=sarah --param=POSTGRESQL_PASSWORD=connor --param=POSTGRESQL_DATABASE=userprofiledb --param=DATABASE_SERVICE_NAME=userprofile-postgresql  -lapp=userprofile -lcomponent=db

until 
	oc get pods | grep "userprofile-postgresql" | grep -m 1 "1/1"
do
	sleep 2
done

# image
# TODO: update properties to use Environment variables for user, pass, database, dabtabase service, update README (are there default options?)
# TODO: update the new-app command, pass in the environment variables
# TODO: update the new-app command to use the generated secret and it's associated entries
oc new-app quay.io/quarkus/centos-quarkus-native-s2i~${USER_PROFILE_GIT_REPO}#${USER_PROFILE_GIT_BRANCH} --context-dir=/code/userprofile --name=userprofile -lcomponent=microservice
oc expose service userprofile

until 
	oc get pods -l deploymentconfig=userprofile | grep -m 1 "1/1"
do
	sleep 20
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
