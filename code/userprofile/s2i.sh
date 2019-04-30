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
oc new-app --template=postgresql-persistent --name=userprofile-postgresql -lapp=userprofile -luserprofile-component=db --param=POSTGRESQL_USER=$POSTGRESQL_USER --param=POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD --param=POSTGRESQL_DATABASE=$POSTGRESQL_DATABASE --param=DATABASE_SERVICE_NAME=$POSTGRESQL_SERVICE_HOST
      
echo 'Wait for postgresql to deploy ..'

until 
	oc get pods -lapp=userprofile-postgresql | grep "userprofile-postgresql" | grep -m 1 "1/1"
do
	sleep 2
done

#  
#using specific version of s2i as latest (rc16 wasn't working)
# this can be improved to use the generated secret from postgressql deploy. for now just use env variable
oc new-app quay.io/quarkus/centos-quarkus-native-s2i:graalvm-1.0.0-rc15~${USER_PROFILE_GIT_REPO}#${USER_PROFILE_GIT_BRANCH}  \
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
# oc delete all,secret -lapp=userprofile-postgresql

#clean pvc
# oc delete pvc userprofile-postgresql
