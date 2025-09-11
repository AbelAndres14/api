FROM node:22.11

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 755 /app/node_modules/.bin/

EXPOSE 3008

CMD ["npm", "run", "dev"]