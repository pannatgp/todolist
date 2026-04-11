FROM node:24-alpine

WORKDIR /app

# Copy entire project
COPY . .

# Install dependencies
WORKDIR /app/backend
RUN npm ci

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]