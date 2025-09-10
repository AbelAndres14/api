FROM node:22.11

WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código después de instalar dependencias
COPY . .

# Exponer el puerto
EXPOSE 5000

# Ejecutar npm run dev automáticamente
CMD ["npm", "run", "dev"]