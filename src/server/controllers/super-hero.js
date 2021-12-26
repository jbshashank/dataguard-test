'use strict';

const superHeroFormatter = require('../../formatters/super-hero');

module.exports = class SuperHeroController {
  constructor({ SuperHeroService }) {
    this.SuperHeroService = SuperHeroService;
  }

  async getAllSuperHeros() {
    const { SuperHeroService } = this;

    const superHeros = await SuperHeroService.getAllSuperHeros();

    return superHeros.map(superHeroFormatter);
  }

  async getSpecificSuperHero(request) { 
  const { SuperHeroService } = this;

  const {superHeros} = await SuperHeroService.getAllSuperHeros();

  return superHeroFormatter(superHeros);
  }

  async createSuperHero(request) { 
  const { SuperHeroService } = this;

  const superHeros = await SuperHeroService.addNewSuperHero(request);

  return superHeroFormatter(superHeros);
  
}

async deleteSuperHero(request) { 
  const { SuperHeroService } = this;

  const superHeros = await SuperHeroService.deleteSuperHero(request);

  return superHeroFormatter(superHeros);
  
}

};
