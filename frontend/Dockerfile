# Frontend Dockerfile - Multi-stage build
# Stage 1: Builder - Build Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG VITE_API_URL=""

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build the app with environment variable
RUN VITE_API_URL=$VITE_API_URL npm run build

# Stage 2: Runtime - Serve with Nginx
FROM nginx:alpine

# Default backend URL (Docker Compose uses backend:4000, Render uses its own URL)
ENV BACKEND_URL=http://backend:4000

# Copy nginx config as template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Substitute env vars in nginx config at container startup, then start nginx
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
