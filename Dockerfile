# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY src/ .

# Define the command to run your bot
CMD ["node", "index.js"]
