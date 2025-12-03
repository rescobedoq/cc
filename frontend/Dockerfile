FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Ejecutamos el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
