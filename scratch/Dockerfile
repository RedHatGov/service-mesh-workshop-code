FROM centos:7
ENV RELEASE_PATH target/boards-swarm.jar
RUN yum install -y \
    java-1.8.0-openjdk-headless \
  && yum clean all

WORKDIR /opt/boards

ADD ${RELEASE_PATH} /opt/boards

RUN groupadd -r duser -g 1001 \
    && useradd -u 1001 -r -g duser -d /opt/boards/ -s /sbin/nologin -c "Docker image user" duser \
    && chown -R duser:duser /opt/boards/ \
    && chgrp -R 0 /opt/boards && chmod -R g=u /opt/boards

USER 1001


EXPOSE 8080

ENV PORT_OFFSET=0
ENV LOGGING_LEVEL=INFO

CMD java -jar /opt/boards/boards-swarm.jar \
    -Dswarm.port.offset=${PORT_OFFSET} \
    -Dswarm.logging=${LOGGING_LEVEL}
