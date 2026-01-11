# Build stage
FROM node:25-alpine AS build

WORKDIR /app

# config files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
# ENV NODE_ENV=development
RUN npm install

# Copy application code
COPY src ./src

RUN npm run build
RUN ls dist

# Production
FROM node:25-alpine AS production

WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY package*.json ./
COPY .env ./.env

RUN npm install --omit=dev


# Expose backend port
ENV PORT 5000
EXPOSE $PORT

RUN ls dist
# Start the backend server
CMD ["npm" , "start"]