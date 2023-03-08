FROM node:alpine

WORKDIR /react/wheel-component

EXPOSE 3000

COPY ./package*.json .

RUN ["npm", "install"]

COPY . .

CMD [ "npm", "start" ]
