# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for PDFKit
RUN apk add --no-cache \
    fontconfig \
    freetype \
    ttf-dejavu \
    ttf-wqy-zenhei

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Build React app (if this is a monorepo with frontend and backend)
RUN npm run build

# Create directory for certificates
RUN mkdir -p src/server/certificates

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "src/server/server.js"]