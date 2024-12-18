# Use the official Node.js 14 image as the base image
FROM node:14

# Create a working directory for the app
WORKDIR /app

# Install the serve command globally
# RUN npm install -g serve

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies for the app
RUN npm install

# Install the dependencies for the app
RUN npm install

# Copy the rest of the app's code to the container
COPY . .

# Build the app
RUN npm run build

RUN npm install -g serve

# Set the default command for the container to run the app
CMD ["serve", "-s", "build"]