FROM node:8

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
COPY timezone /etc/timezone

RUN dpkg-reconfigure -f noninteractive tzdata
EXPOSE 8081
CMD [ "npm","run", "start" ]
