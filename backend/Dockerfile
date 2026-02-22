FROM node:20
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm install

# Copy source and data
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 8080

# Use production environment
ENV NODE_ENV=production

# Start the server
CMD [ "npm", "start" ]
