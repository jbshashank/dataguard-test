'use strict';

const Joi = require('joi');
const { ENVIRONMENTS } = require('../constants');
const MICROSERVICES = require('../constants/microservices');

module.exports = Joi.object().keys({
  env: Joi.string().valid(...Object.values(ENVIRONMENTS)).required(),
  name: Joi.string().required(),
  version: Joi.string().min(5).required(),
  server: Joi.object().keys({
    port: Joi.number().integer().min(0).required(),
    keepAliveTimeout: Joi.number().integer().min(1).required(),
    returnValidationInfoError: Joi.boolean().required(),
  }),
  mongodb: Joi.object().keys({
    url: Joi.string().required(),
    poolSize: Joi.number().integer().min(1).required(),
    serverSelectionTimeoutMS: Joi.number().required().default(30000),
  }),
  swagger: Joi.object().keys({
    enabled: Joi.boolean().required(),
  }),
  log: Joi.object().keys({
    name: Joi.string().required(),
    version: Joi.string().min(5).required(),
    env: Joi.string().valid(...Object.values(ENVIRONMENTS)).required(),
    level: Joi.string().valid(
      'silent', 'error', 'warn', 'info', 'debug',
    ).required(),
    isPrettyLoggingEnabled: Joi.boolean().required(),
    prettyLoggingDepth: Joi.any(),
  }),
  microservice: Joi.object().keys({
    urls: Joi.object().keys({
      [MICROSERVICES.example]: Joi.string().required(),
    }),
    timeout: Joi.number().integer().min(1).required(),
  }),
});
