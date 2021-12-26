# Builder Docker configurations
FROM node:16-alpine AS builder

# Add necessary build tools
RUN apk add --no-cache make gcc g++ python2

# Change working directory
WORKDIR /application

# Add required files
ADD ./package.json ./package.json
ADD ./package-lock.json ./package-lock.json

# Install dependencies
RUN npm install 

# Release Docker configurations
FROM node:16-alpine AS release

# Change working directory
WORKDIR /application

# Add the project files
ADD . .

# Copy dependencies from builder image
COPY --from=builder /application/node_modules /application/node_modules

# Expose port
EXPOSE 8080

CMD ["node", "/application"]
