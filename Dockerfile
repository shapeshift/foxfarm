# Base image and necessary packages
FROM node:14-alpine

RUN apk update && \
    apk upgrade && \
    apk add bash git python make alpine-sdk curl jq py-pip

ARG NPM_TOKEN

WORKDIR /usr/src/app

COPY .npmrc ./
COPY . .
RUN yarn && yarn build
RUN rm -f .npmrc
COPY . .

EXPOSE 8000