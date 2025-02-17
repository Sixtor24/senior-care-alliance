# Usar una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación web
EXPOSE 8081

# Comando para iniciar la aplicación web
CMD ["npm", "run", "web"]