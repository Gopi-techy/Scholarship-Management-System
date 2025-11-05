# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && \
    npm cache clean --force

# Copy source code and config files
COPY . .

# Build application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 10240; \
    gzip_proxied expired no-cache no-store private auth; \
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript; \
    gzip_disable "MSIE [1-6]\."; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Handle client-side routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Disable logging for health checks \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf.default 2>/dev/null || true

# Create non-root user
RUN addgroup -g 101 -S nginx-runner && \
    adduser -S nginx-runner -u 101 -G nginx-runner

# Set permissions
RUN chown -R nginx-runner:nginx-runner /usr/share/nginx/html && \
    chown -R nginx-runner:nginx-runner /var/cache/nginx && \
    chown -R nginx-runner:nginx-runner /var/log/nginx && \
    chown -R nginx-runner:nginx-runner /etc/nginx/conf.d

# Create nginx pid directory
RUN mkdir -p /var/run && \
    chown -R nginx-runner:nginx-runner /var/run

# Update nginx config to run as non-root
RUN sed -i 's/user  nginx;/user  nginx-runner;/' /etc/nginx/nginx.conf || true

# Switch to non-root user
USER nginx-runner

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 