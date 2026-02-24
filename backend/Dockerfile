FROM node:20-slim
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built distribution and necessary data
COPY dist ./dist
COPY data ./data

# Expose port
EXPOSE 8080

# Use production environment
ENV NODE_ENV=production

# Start the server
CMD [ "node", "dist/index.js" ]
