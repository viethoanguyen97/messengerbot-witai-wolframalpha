FROM node:8.10

# Create app directory
RUN mkdir -p /usr/src/app/UETGeoBot/botserver
WORKDIR /usr/src/app/UETGeoBot/botserver

# Install NPM
COPY package.json /usr/src/app/UETGeoBot/botserver
RUN yarn install

# Bundle app source
COPY . /usr/src/app/UETGeoBot/botserver

EXPOSE 4005

CMD ["npm","start"]
