FROM ubuntu:16.04
MAINTAINER iurii <iurii@wearepush.co>

ARG ENVIRONMENT

RUN apt-get update -yq && apt-get upgrade -yq && apt-get install -y\
    python \
    curl \
    build-essential

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - \
    && apt-get install -y\
    nodejs

# Switch to directory for external dependencies (installed from source)
WORKDIR /external

# Install (global) NPM packages/dependencies
RUN npm install -g \
    node-gyp \
    webpack

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install yarn

# Switch to directory with sources
WORKDIR /src
ADD . /src/

# Copy package json and install dependencies
COPY package.json .

# Install (local) NPM and Bower packages/dependencies
RUN yarn --ignore-optional

# Copy required stuff
ADD . .

RUN sed -i -e "s/frontend.dev.viemate.com/frontend.prod.viemate.com/" newrelic.js

RUN npm run build

# Expose SERVER ports
EXPOSE 8080

# Specify default CMD
CMD ["npm", "run", "start"]
