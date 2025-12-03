FROM node:20-alpine

# Crea un directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Comando por defecto 
CMD ["npm", "run", "dev"]
