FROM node:14.21.3

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

COPY meteor-install.sh .

RUN sh meteor-install.sh

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN mkdir -p .meteor/local
RUN chmod -R 700 .meteor/local
RUN meteor npm install

EXPOSE 3000

# Starting meteor app. The application might take a while to start properly
CMD ["meteor"]
