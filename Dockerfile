FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable
COPY --from=builder /app/dist/browser /usr/share/nginx/html
EXPOSE 80
