'use strict';

const R = require('ramda');
const Joi = require('joi');

const { ENVIRONMENTS } = require('../constants');
const environments = require('./environments');
const getDefaultConfig = require('./default');
const configValidationSchema = require('./schema');

// env param is only used for test purpose
module.exports = ({ env: chosenEnv } = {}) => {
  const env = chosenEnv ?? process.env.NODE_ENV ?? ENVIRONMENTS.DEV;

  const getEnvSpecificConfig = environments[env];

  const config = R.mergeDeepRight(getDefaultConfig(), getEnvSpecificConfig());

  Joi.assert(config, configValidationSchema, 'Config validation failed');

  return config;
};
