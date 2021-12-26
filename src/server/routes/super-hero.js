'use strict';

const {
  getAllSuperHeros,
  getSuperHero,
  createSuperHeros,
  deleteSuperHero
} = require('../../schemas/controllers/super-hero');

module.exports = ([
  {
    path: '/superheros',
    method: 'GET',
    options: {
      tags: ['api'],
      description: 'get All superheros data',
      validate: { payload: getAllSuperHeros.request?.payload },
      response: { schema: getAllSuperHeros.response },
      plugins: {
        logging: true,
      },
    },
    handler: 'SuperHeroController.getAllSuperHeros',
  },
  {
    path: '/superheros/{name}',
    method: 'GET',
    options: {
      tags: ['api'],
      description: 'Get all example data.',
      validate: getSuperHero.validate,
      response: { schema: getSuperHero.response },
    plugins: {
        logging: true,
      },
    },
    handler: 'SuperHeroController.getSuperHero',
  },
  {
    path: '/superheros',
    method: 'POST',
    options: {
      tags: ['api'],
      description: 'Get all example data from db.',
      validate: { payload: createSuperHeros.request?.payload },
      response: { schema: createSuperHeros.response },
      plugins: {
        logging: true,
      },
    },
    handler: 'SuperHeroController.createSuperHero',
  },
  {
    path: '/superheros/{name}',
    method: 'DELETE',
    options: {
      tags: ['api'],
      description: 'Delete a super hero from db.',
      validate: deleteSuperHero.validate,
      response: { schema: deleteSuperHero.response },
      plugins: {
        logging: true,
      },
    },
    handler: 'SuperHeroController.deleteSuperHero',
  },
]);
