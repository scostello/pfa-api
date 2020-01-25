FROM quay.io/sean.costello/nodejs-rdkafka:12.14.1-1.3.0

ENV APPS_DIR=/apps
ENV APP_NAME=pfa-api
ENV APP_PATH=${APPS_DIR}/${APP_NAME}
ENV BUILD_LIBRDKAFKA=0

WORKDIR ${APP_PATH}

COPY package*.json tsconfig.json ./
COPY src/ src/

RUN npm ci \
  && npm run build \
  && apk del build-deps

COPY docker-entrypoint.sh /usr/local/bin

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]