FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript (optional, if you’re not using ts-node)
RUN npm run build

# Expose the port your server listens on
EXPOSE 3001

# Start the server using ts-node (or use compiled JS if using tsc)
CMD ["npx", "ts-node", "server.ts"]
