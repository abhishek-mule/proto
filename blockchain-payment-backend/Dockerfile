# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application's source code from your host to your image filesystem.
COPY . .

# Compile the smart contracts
RUN npx hardhat compile

# Make port 8545 available to the world outside this container
EXPOSE 8545

# Define the command to run your app
CMD ["npx", "hardhat", "node"]
