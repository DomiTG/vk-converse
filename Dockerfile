# Step 1: Use Node.js LTS as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the Prisma schema and application code
COPY prisma ./prisma
COPY . .

# Step 7: Build the Next.js application
RUN npm run build

# Step 8: Use a minimal image for production
FROM node:18-alpine AS runner

# Step 9: Set the working directory
WORKDIR /app

# Step 10: Copy the built application, dependencies, and Prisma client
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Step 11: Copy the .env file
COPY .env .env

# Step 12: Expose the port
EXPOSE 3000

# Step 13: Start the application
CMD ["npm", "run", "start"]
