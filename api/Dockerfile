FROM node:22
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p uploads
ENV APP_PORT 8080
EXPOSE 8080
CMD [ "node", "app.js" ]