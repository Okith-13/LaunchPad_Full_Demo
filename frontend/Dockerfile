# Stage 1: Build Vite bundle with Node
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build arguments for Vite variables compiled at build time
ARG VITE_AUTH_API_URL=http://localhost:5001/api/auth
ARG VITE_RESTAURANT_API_URL=http://localhost:5002/api
ARG VITE_ORDER_API_URL=http://localhost:5003/api/orders
ARG VITE_DELIVERY_API_URL=http://localhost:5004/api/deliveries
ARG VITE_CUSTOMER_API_URL=http://localhost:5005/api/customers

ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_RESTAURANT_API_URL=$VITE_RESTAURANT_API_URL
ENV VITE_ORDER_API_URL=$VITE_ORDER_API_URL
ENV VITE_DELIVERY_API_URL=$VITE_DELIVERY_API_URL
ENV VITE_CUSTOMER_API_URL=$VITE_CUSTOMER_API_URL

RUN npm run build

# Stage 2: Serve compiled assets with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]