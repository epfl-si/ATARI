ARG BASE_IMAGE=node:22.22.0

FROM $BASE_IMAGE AS build

RUN npx meteor
ENV NODE_ENV=production

ENV PATH=$PATH:/root/.meteor
ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN meteor npm install
RUN set -e -x; mkdir /app; meteor build --directory /app; \
    cd /app/bundle/programs/server ; meteor npm install --production

COPY docker/npm-mongo.patch /tmp/
RUN set -e -x; cd /app/bundle; \
  patch -p0 < /tmp/npm-mongo.patch

FROM $BASE_IMAGE

ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/bundle

CMD ["node", "main.js"]
