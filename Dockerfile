FROM node:18.12.1-slim AS base
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/

FROM base AS dev
RUN yarn install
COPY . .


