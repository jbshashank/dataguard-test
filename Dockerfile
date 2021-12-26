# Builder Docker configurations
FROM alpine:3.14 AS builder

# Add necessary build tools
RUN apk add --no-cache make gcc g++ python2

# Change working directory
WORKDIR /application

# Add required files
ADD ./.npmrc ./
ADD ./package.json ./package.json
ADD ./package-lock.json ./package-lock.json

# Install dependencies
RUN npm ci --only=production && \
  rm /application/.npmrc

# Release Docker configurations
FROM alpine:3.14 AS release

# Change working directory
WORKDIR /application

# Add the project files
ADD . .

# Remove outdated npm_modules directory and .npmrc file if exists
RUN rm -rf /application/node_modules /application/.npmrc

# Copy dependencies from builder image
COPY --from=builder /application/node_modules /application/node_modules

# Expose port
EXPOSE 8080

CMD ["node", "/application"]
