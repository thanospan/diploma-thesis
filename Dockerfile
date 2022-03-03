FROM node:16.14.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3007
CMD [ "node", "app.js" ]
