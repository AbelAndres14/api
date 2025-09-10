FROM node:22.11

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 5000

CMD ["npx", "next", "dev", "-p", "5000"]