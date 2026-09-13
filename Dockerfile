# Multi-stage Docker build: Vite build → nginx serve
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (devDeps needed for vite build)
RUN npm ci

# Copy source code
COPY . .

# Build application (VITE_ vars must be set as build-args / env at build time)
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root (nginx user exists in nginx:alpine)
USER nginx

# Expose port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
