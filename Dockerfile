# Use Node base image
FROM node:23-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Environment variable for development mode
ENV NODE_ENV=development

# Command to start NestJS with live-reload using ts-node (if in development)
CMD ["npm", "run", "start"]
