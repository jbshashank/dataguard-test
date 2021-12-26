'use strict';

const Joi = require('../../utils/joi');

module.exports = {
  getAllSuperHeros: {
    request: {},
    response: (
      Joi
        .array()
        .items(
        Joi
        .object()
        .keys({
          alias: Joi.string(),
          name: Joi.string(),
          powers: (
            Joi
              .array()
              .items(
                Joi
                  .string(),
              )
          ),
        weapons: (
          Joi
            .array()
            .items(
              Joi
                .string(),
            )
        ),
        origin: Joi.string(),
        associations: (
            Joi
              .array()
              .items(
                Joi
                  .string(),
              )
          ),
        })    
      )),
  },
  getSuperHero: {
    validate: {
      params: Joi.object({ name: Joi.string().required() }),
    },
    response: (
      Joi
      .object()
      .keys({
        alias: Joi.string(),
        name: Joi.string(),
        powers: (
          Joi
            .array()
            .items(
              Joi
                .string(),
            )
        ),
      weapons: (
        Joi
          .array()
          .items(
            Joi
              .string(),
          )
      ),
      origin: Joi.string(),
      associations: (
          Joi
            .array()
            .items(
              Joi
                .string(),
            )
        ),
      })    
    ),
  },
  createSuperHeros: {
    request: {
      payload: (
        Joi
        .object()
        .keys({
          alias: Joi.string(),
          name: Joi.string(),
          powers: (
            Joi
              .array()
              .items(
                Joi
                  .string(),
              )
          ),
        weapons: (
          Joi
            .array()
            .items(
              Joi
                .string(),
            )
        ),
        origin: Joi.string(),
        associations: (
            Joi
              .array()
              .items(
                Joi
                  .string(),
              )
          ),
        })    
      ),
    },
    response: Joi.any(),
  },
  deleteSuperHero: {
    validate: {
      params: Joi.object({ name: Joi.string().required() }),
    },
    response: Joi.any(),
  },
};
