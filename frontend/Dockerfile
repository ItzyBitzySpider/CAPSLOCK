FROM node:latest As builder
WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

RUN npm run build

# Bundle static assets with nginx
FROM nginx:latest as production
ENV NODE_ENV proudction
# Copy built assets from builder
COPY --from=builder /usr/app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
