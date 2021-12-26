'use strict';

const Joi = require('joi');
const joiObjectIdExtension = require('./object-id');


module.exports = Joi.extend(joiObjectIdExtension);