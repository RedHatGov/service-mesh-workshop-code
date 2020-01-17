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
oc new-app registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift~${USER_PROFILE_GIT_REPO}#${USER_PROFILE_GIT_BRANCH}  \
 --context-dir=/code/userprofile --name=userprofile-jvm -luserprofile-component=microservice \
 --env POSTGRESQL_USER=$POSTGRESQL_USER \
 --env POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD \
 --env POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE \
 --env POSTGRESQL_SERVICE_HOST=$POSTGRESQL_SERVICE_HOST 

oc expose service userprofile-jvm

echo 'Wait for build to complete ..'

until 
 oc get builds -lapp=userprofile-jvm | grep Complete 
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
# oc delete all -lapp=userprofile-jvm
# oc delete all,secret -lapp=userprofile-postgresql

#clean pvc, secret
# oc delete pvc userprofile-postgresql
# oc delete secret userprofile-postgresql
