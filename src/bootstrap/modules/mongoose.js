'use strict';

const awilix = require('awilix');
const mongoose = require('mongoose');

module.exports = async (container) => {
  const { mongodb: mongodbConfig } = container.resolve('config');
  const { url, serverSelectionTimeoutMS, poolSize } = mongodbConfig;

  const logger = container.resolve('logger');

  let mongooseConnection;

  const start = async () => {
    mongooseConnection = await mongoose.createConnection(url, {
      poolSize,
      serverSelectionTimeoutMS,
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: false,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    const addUpdateOptionNew = (schema) => {
      schema.pre('findOneAndUpdate', function addUpdateOptionNewPreFindOneAndUpdate(next) {
        if (this.options.new === undefined) {
          this.findOneAndUpdate({}, {}, { new: true });
        }
        else if (this.options.new === false) {
          logger.info('addUpdateOptionNewPreFindOneAndUpdate', 'this.options.new === false');
        }

        next();
      });
    };

    const addUpdatedAt = (schema) => {
      schema.pre('findOneAndUpdate', function addUpdatedAtPreFindOneAndUpdate(next) {
        this.findOneAndUpdate({}, { $set: { updatedAt: new Date() } });
        next();
      });

      schema.pre('update', function addUpdatedAtPreUpdate(next) {
        this.update({}, { $set: { updatedAt: new Date() } });
        next();
      });
    };

    mongoose.plugin(addUpdateOptionNew);
    mongoose.plugin(addUpdatedAt);

    return mongooseConnection;
  };

  const stop = async () => (
    mongooseConnection.close()
  );

  const register = async () => (
    container.register('mongooseConnection', awilix.asValue(mongooseConnection))
  );

  return {
    start,
    stop,
    register,
  };
};
