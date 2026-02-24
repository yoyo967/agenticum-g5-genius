FROM node:20-slim
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code and config
COPY . .

# Build the application (runs tsc)
RUN npm run build

# Remove development dependencies to keep image slim
RUN npm prune --production

# Expose port
EXPOSE 8080

# Use production environment
ENV NODE_ENV=production

# Start the server
CMD [ "node", "dist/index.js" ]
