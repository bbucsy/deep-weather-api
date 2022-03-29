FROM node:16.14.2-buster-slim AS appbuild

WORKDIR /build

COPY . .

RUN yarn install && yarn run build



FROM node:16.14.2-buster-slim

ENV NODE_ENV=production


ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]



WORKDIR /home/node

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node ormconfig.js .

RUN yarn install --production 

COPY --from=appbuild --chown=node:node /build/dist ./dist
COPY --from=appbuild --chown=node:node /build/models ./models

USER node
CMD ["node", "dist/main.js"]