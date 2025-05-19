# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the port your app runs on (default: 3000)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]