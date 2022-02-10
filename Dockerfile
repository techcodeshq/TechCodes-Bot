FROM node:16

WORKDIR /usr/src/bot

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

RUN ./gen-config.py

CMD ["npm", "restart"]
