# Stage 1: Build static web assets using Expo
FROM node:20-alpine AS builder

WORKDIR /app

# Accept backend API URL as build argument
ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .

# Export static web files
RUN npx expo export -p web --no-minify --output-dir dist

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for single page application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
