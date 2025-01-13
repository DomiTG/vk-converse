# Step 1: Use Node.js LTS as the base image
FROM node:20-alpine AS builder

# Step 2: Install OpenSSL and other dependencies
RUN apk add --no-cache openssl

# Step 3: Set the working directory
WORKDIR /app

# Step 4: Copy package.json and package-lock.json
COPY package*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy the Prisma schema and application code
COPY prisma ./prisma
COPY . .

# Step 7: Pull the database schema and generate the Prisma client
RUN npx prisma db pull
RUN npx prisma generate

# Step 8: Build the Next.js application
RUN npm run build

# Step 9: Use a minimal image for production
FROM node:20-alpine AS runner

# Step 10: Install OpenSSL in the production image
RUN apk add --no-cache openssl

# Step 11: Set the working directory
WORKDIR /app

# Step 12: Copy the built application, dependencies, and Prisma client
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Step 13: Copy the .env file
COPY .env .env

# Step 14: Expose the port
EXPOSE 3000

# Step 15: Start the application
CMD ["npm", "run", "start"]
