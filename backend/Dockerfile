FROM node:latest

WORKDIR /usr/app

COPY package.json yarn.lock ./

# RUN yarn install
RUN yarn install

COPY . .

# RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN yarn build

CMD ["yarn", "start"]
