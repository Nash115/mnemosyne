FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npx tsc

CMD [ "node", "dist/index.js" ]
