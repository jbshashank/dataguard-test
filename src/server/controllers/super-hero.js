'use strict';

const superHeroFormatter = require('../../formatters/super-hero');
const notFoundError = 

module.exports = class SuperHeroController {
  constructor({ SuperHeroService,logger }) {
    this.SuperHeroService = SuperHeroService;
    this.logger = logger;
  }

  async getAllSuperHeros() {
    const { SuperHeroService } = this;

    const superHeros = await SuperHeroService.getAllSuperHeros();

    return superHeros.map(superHeroFormatter);
  }

  async getSuperHero(request) { 
  const { SuperHeroService,logger } = this;

  const { specificSuperHeroData } = await SuperHeroService.getSpecificSuperHero(request);

  logger.debug('data',{specificSuperHeroData})
  if(specificSuperHeroData.length == 1)
    return superHeroFormatter(specificSuperHeroData[0]);
  
    return {};
  }

  async createSuperHero(request) { 
  const { SuperHeroService } = this;

  const { success } = await SuperHeroService.addNewSuperHero(request);

  return {
    success
  };  
}

async deleteSuperHero(request) { 
  const { SuperHeroService } = this;

  const { success } = await SuperHeroService.deleteSuperHero(request);

  return {
    success
  };
  
}

};
