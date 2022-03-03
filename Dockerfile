FROM node:16.14.0-alpine3.15 AS appbuild

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn run build



FROM node:16.14.0-alpine3.15

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN yarn install --production 

COPY --from=appbuild --chown=node:node /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/main.js"]