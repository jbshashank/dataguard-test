'use strict';

const pkg = require('../../package.json');
const { ENVIRONMENTS } = require('../constants');
const MICROSERVICES = require('../constants/microservices');

module.exports = () => {
  const name = process.env.NAME ?? pkg.name;
  const version = process.env.VERSION ?? pkg.version;
  const env = process.env.NODE_ENV ?? ENVIRONMENTS.DEV;

  return {
    name,
    version,
    env,
    mongodb: {
      url: process.env.MONGODB_URL,
      poolSize: Number(process.env.MONGODB_POOL_SIZE ?? 10),
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT ?? 30000),
    },
    server: {
      port: Number(process.env.SERVER_PORT ?? process.env.PORT ?? 8080),
      keepAliveTimeout: Number(process.env.SERVER_KEEP_ALIVE_TIMEOUT ?? 120000),
      returnValidationInfoError: (process.env.SERVER_RETURN_VALIDATION_INFO_ERROR ?? 'false').trim().toLowerCase() === 'true',
    },
    swagger: {
      enabled: (process.env.SWAGGER_ENABLED ?? 'false').trim().toLowerCase() === 'true',
    },
    log: {
      name,
      version,
      env,
      level: process.env.LOG_LEVEL ?? 'info',
      isPrettyLoggingEnabled: (process.env.LOG_IS_PRETTY_LOGGING_ENABLED ?? 'false').trim().toLowerCase() === 'true',
      prettyLoggingDepth: process.env.LOG_PRETTY_LOGGING_DEPTH,
    },
    microservice: {
      urls: {
        [MICROSERVICES.example]: process.env.MICROSERVICE_URLS_EXAMPLE,
      },
      timeout: Number(process.env.MICROSERVICE_TIMEOUT ?? 10000),
    },
  };
};
