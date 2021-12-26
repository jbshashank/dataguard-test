'use strict';

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { ExampleError } = require('../errors/types');

const ExampleLogic = require('../logic/example');

module.exports = class SuperHeroService {
  constructor({
    logger,
    catcher,
    SuperHeroDataAccess,
  }) {
    this.logger = logger;
    this.catcher = catcher;
    this.SuperHeroDataAccess = SuperHeroDataAccess;
  }

  async getAllSuperHeros() {
    const {
      logger,
      SuperHeroDataAccess,
    } = this;

    const superHeroData =  await SuperHeroDataAccess.getAllSuperHeroes();
    logger.debug('All super heros', {
      superHeroData
    })

    return superHeroData;
  }

  async getSpecificSuperHero(req ) {
    const {
      logger,
      SuperHeroDataAccess,
    } = this;

    const { name } = req.params;

    const specificSuperHeroData =  await SuperHeroDataAccess.getSpecificSuperHero({name});
    logger.debug('Super heros data', {
      specificSuperHeroData
    })

    return {
      specificSuperHeroData
    }
  }

  async addNewSuperHero(request) {
    const {
      logger,
      SuperHeroDataAccess,
    } = this;

    
    const superHero = request?.payload;
    const { name } = request?.payload;

    logger.debug('Before Adding heros data', 
      {superHero,name}
    )

    const superHeroData =  await SuperHeroDataAccess.addNewSuperHero({name,superHero});
    logger.debug('Adding heros data', {
        superHeroData
    })

    return {
      superHeroData
    }
  
  }


  async deleteSuperHero(request) {
    const {
      logger,
      SuperHeroDataAccess,
    } = this;

    
    const { name } = request?.params;

    const superHeroData =  await SuperHeroDataAccess.deleteSuperHero({ name });

    return {
      superHeroData
    }
  
  }

};
