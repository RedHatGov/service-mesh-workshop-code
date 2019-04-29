#TODO
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
#USER_PROFILE_OCP_PROJECT=user-profile-gbenga


# TODO: update the new-app command to use the generated secret and it's associated entries when using template
#using specific version of s2i as latest (rc16 wasn't working)

#oc new-app ../deployemnt.//

# delete
# oc delete -f template.