FROM node:25-alpine AS dev


WORKDIR /

COPY package*.json ./

RUN npm install

COPY public ./public
COPY app ./app

CMD ["npm", "run", "dev"]