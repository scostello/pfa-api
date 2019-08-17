FROM quay.io/sean.costello/nodejs-rdkafka:12.3.1-1.0.1@sha256:a93b5e065499dd2bdc409fe24747046e1040477cc5c917dc973fb224a5ef15db

ENV APPS_DIR=/apps
ENV APP_NAME=pfa-api
ENV APP_PATH=${APPS_DIR}/${APP_NAME}
ENV BUILD_LIBRDKAFKA=0

WORKDIR ${APP_PATH}

COPY package*.json yarn.lock .babelrc ./
COPY src/ src/

RUN \
  yarn install &&\
  yarn run build &&\
  apk del build-deps

COPY docker-entrypoint.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint.sh"]