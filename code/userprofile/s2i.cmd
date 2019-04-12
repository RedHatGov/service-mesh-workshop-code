# image
oc new-app quay.io/quarkus/centos-quarkus-native-s2i~https://github.com/gbengataylor/openshift-microservices#develop --context-dir=/code/userprofile --name=userprofile

#openjdk - won't work
#oc new-app java~https://github.com/gbengataylor/openshift-microservices#develop --context-dir=/code/userprofile --name=userprofile-jdk
