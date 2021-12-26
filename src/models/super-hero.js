'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SuperHero = new Schema({
  alias: { type: String },
  name: { type: String },
  powers: [{ type: String }],
  weapons: [{ type: String }],
  origin: { type: String },
  associations: [{ type: String }],
});

module.exports = ({ mongooseConnection }) => mongooseConnection.model('SuperHero', SuperHero);
