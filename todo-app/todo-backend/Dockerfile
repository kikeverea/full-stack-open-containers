FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

ENV NODE_ENV=production

RUN npm ci

USER node

CMD npm start
