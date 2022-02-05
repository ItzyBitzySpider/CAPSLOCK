FROM node:latest

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3003

CMD ["npm", "start"]