FROM node:16.14.2-alpine3.15 AS appbuild

WORKDIR /build

COPY . .

RUN yarn install && yarn run build



FROM node:16.14.2-alpine3.15

ENV NODE_ENV=production
RUN apk add --no-cache tini
WORKDIR /home/node

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node ormconfig.js .

RUN yarn install --production 

COPY --from=appbuild --chown=node:node /build/dist ./dist

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]