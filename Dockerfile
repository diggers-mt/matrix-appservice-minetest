FROM node:8.4.0

RUN mkdir /src

WORKDIR /src
ADD package.json /src/package.json
RUN npm install

EXPOSE 9000
EXPOSE 9898

CMD node app.js -p 9000 -c config/config.yaml
