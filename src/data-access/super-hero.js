'use strict';

module.exports = class SuperHeroDataAccess {
  constructor({ SuperHeroModel }) {
    this.SuperHeroModel = SuperHeroModel;
  }

  async getAllSuperHeroes() {
    const { SuperHeroModel } = this;
    return (
      SuperHeroModel
        .find()
        .lean()
        .exec()
    );
  }

  async getSpecificSuperHero({name}) {
    const { SuperHeroModel } = this;
    return SuperHeroModel.find({name}).lean().exec();
  }

  async addNewSuperHero({name, superHero }) {
    const { SuperHeroModel } = this;
    return (
      SuperHeroModel
        .findOneAndUpdate({
          name
        },
        {
          $set: {...superHero},
        },
        { upsert: true })
        .lean()
        .exec()
    );
  }

  async deleteSuperHero({name}) {
    const { SuperHeroModel } = this;
    return (
      SuperHeroModel
      .deleteOne({ name })
      .lean()
      .exec()
    );
  }
};
