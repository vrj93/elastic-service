FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

ENV NODE_ENV=development

CMD ["npm", "run", "start:dev"]