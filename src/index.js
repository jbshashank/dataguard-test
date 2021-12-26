'use strict';

const { once } = require('./utils/promise');
const DatabaseComponent = require('./bootstrap/modules/mongoose');
const ServerComponentCreator = require('./server');
const container = require('./bootstrap/container');
const { bootstrapWithContainer } = require('./bootstrap/utils');

async function main() {
  const config = container.resolve('config');
  const isSwaggerEnabled = config.swagger.enabled;
  const disabledPlugins = [
    ...(!isSwaggerEnabled ? ['SwaggerPlugin'] : []),
  ];
  const ServerComponent = ServerComponentCreator({ disabledPlugins });

  const componentsToBootstrap = {
    Mongoose: DatabaseComponent,
    Server: ServerComponent,
  };

  const stop = await bootstrapWithContainer(
    container.createScope(),
    componentsToBootstrap,
  );
  const stopOnce = once(stop);

  process.on('SIGTERM', stopOnce);
  process.on('SIGINT', stopOnce);
}

// eslint-disable-next-line no-console
main().catch(console.log);
