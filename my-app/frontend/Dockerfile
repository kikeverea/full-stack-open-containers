FROM node:16 AS setup-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY --from=setup-stage /usr/src/app /usr/src/app

ENV REACT_APP_BACKEND_URL=http://localhost:8080/api

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html