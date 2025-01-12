# Step 1: Use Node.js LTS as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Install only production dependencies
RUN npm ci --production

# Step 8: Use a minimal image for production
FROM node:18-alpine AS runner

# Step 9: Set the working directory
WORKDIR /app

# Step 10: Copy the built application and dependencies from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Step 11: Expose the port
EXPOSE 3000

# Step 12: Start the application
CMD ["npm", "run", "start"]
