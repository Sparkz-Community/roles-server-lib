# ---- Base Node ----
FROM node:lts-alpine AS base
# install node
RUN apk update && \
    apk upgrade

# set working directory
WORKDIR /app


FROM base AS build
# install build base
RUN apk add --no-cache nodejs-current tini && \
    apk add --no-cache --virtual .build-deps alpine-sdk python git && \
    python --version && which python && \
    mkdir -vp /usr/local/opt/python/libexec/bin && \
    ln -vs /usr/bin/python /usr/local/opt/python/libexec/bin/python

COPY .npmrc .npmrc
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM build AS dependencies
# install node packages
RUN npm install --production --silent
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules && \
    cp -R package-lock.json prod_package-lock.json
# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
RUN  npm run eslint
#RUN npm run test

#
# ---- Release ----
FROM base AS release
# copy app sources
COPY . .
RUN rm -rf package-lock.json && \
    rm -rf node_modules
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=dependencies /app/prod_package-lock.json ./package-lock.json
# expose port and define CMD
EXPOSE 3030
CMD ["npm", "run", "start"]
