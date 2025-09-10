FROM node:22.11

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]