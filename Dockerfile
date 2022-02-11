FROM node:16

WORKDIR /usr/src/bot

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "restart"]
