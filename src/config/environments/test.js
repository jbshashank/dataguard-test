'use strict';

const { ENVIRONMENTS } = require('../../constants');
const MICROSERVICES = require('../../constants/microservices');

module.exports = () => ({
  env: ENVIRONMENTS.TEST,
  mongodb: {
    url: process.env.MONGODB_URL ?? 'mongodb+srv://shashank-mongo:mongofree@cluster0.1umqx.mongodb.net/cluster0?retryWrites=true&w=majority',
  },
  microservice: {
    urls: {
      [MICROSERVICES.example]: process.env.MICROSERVICE_URLS_EXAMPLE ?? 'http://localhost:9000/',
    },
  },
});
