# Simple Dockerfile for the Notes App backend
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build-time/Runtime envs are expected at runtime (e.g. JWT_SECRET, MONGODB_URI)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]

