FROM node:latest

WORKDIR /usr/app
COPY package.json .
RUN yarn install
ADD . /usr/app
RUN yarn build
CMD [ "yarn", "start" ]
EXPOSE 4000