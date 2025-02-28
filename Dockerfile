# Stage 1: Build the app
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of your application code
COPY . .

# Build the web app using the new Expo export command for web
RUN npx expo export -p web

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy the built static files from the builder stage to Nginx's html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx config file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
