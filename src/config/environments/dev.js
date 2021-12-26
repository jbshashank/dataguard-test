'use strict';

const { ENVIRONMENTS } = require('../../constants');
const MICROSERVICES = require('../../constants/microservices');

module.exports = () => ({
  env: ENVIRONMENTS.DEV,
  mongodb: {
    url: process.env.MONGODB_URL ?? 'mongodb+srv://shashank-mongo:mongofree@cluster0.1umqx.mongodb.net/cluster0?retryWrites=true&w=majority',
    poolSize: Number(process.env.MONGODB_POOL_SIZE ?? 4),
  },
  server: {
    returnValidationInfoError: (process.env.SERVER_RETURN_VALIDATION_INFO_ERROR ?? 'true').trim().toLowerCase() === 'true',
  },
  swagger: {
    enabled: (process.env.SWAGGER_ENABLED ?? 'true').trim().toLowerCase() === 'true',
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'debug',
    isPrettyLoggingEnabled: (process.env.LOG_IS_PRETTY_LOGGING_ENABLED ?? 'true').trim().toLowerCase() === 'true',
  },
  microservice: {
    urls: {
      [MICROSERVICES.example]: process.env.MICROSERVICE_URLS_EXAMPLE ?? 'http://localhost:9000/',
    },
  },
});
