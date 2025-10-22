# Use Node 20
FROM node:20

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 5001

# Run with nodemon (from devDependencies) for hot-reloading
CMD ["npm", "run", "dev"]