FROM node:20.16-alpine

WORKDIR /bias-app

COPY package*.json /bias-app/

RUN npm init -y 

RUN npm install --force

COPY . /bias-app

EXPOSE 3000

CMD ["npm", "start"]
