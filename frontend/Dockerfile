FROM node:latest

# ENV NODE_ENV=production
WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

RUN npm run build
RUN npm install -g serve

CMD serve -s -p 80 build/
