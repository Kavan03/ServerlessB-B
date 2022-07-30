# reference: https://dev.to/karanpratapsingh/dockerize-your-react-app-4j2e

FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install --legacy-peer-deps
COPY ./ /app/
RUN npm run build

FROM nginx
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80