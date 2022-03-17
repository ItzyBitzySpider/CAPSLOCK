FROM node:latest

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 3000

CMD ["npm", "start"]