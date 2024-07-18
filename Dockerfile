FROM node:20.15.1-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run db:generate

RUN npm run build

CMD ["npm", "run", "start"]