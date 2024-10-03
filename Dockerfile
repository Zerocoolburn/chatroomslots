# Base image for Node.js
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the frontend (if needed)
RUN npm run build

# Expose the port (change to your app's port if different)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
