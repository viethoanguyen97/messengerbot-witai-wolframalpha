FROM node:8.10

# Create app directory
RUN mkdir -p /usr/src/app/UETGeoBot/witapi
WORKDIR /usr/src/app/UETGeoBot/witapi

# Install NPM
COPY package.json /usr/src/app/UETGeoBot/witapi
RUN yarn install

# Bundle app source
COPY . /usr/src/app/UETGeoBot/witapi

EXPOSE 4000

CMD ["npm","start"]
