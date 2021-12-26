'use strict';

module.exports = {
  ENVIRONMENTS: {
    DEV: 'dev',
    PROD: 'prod',
    TEST: 'test',
  },

  EXAMPLE_STATUSES: {
    ACTIVE: 100,
    INACTIVE: 200,
  },

  MONGOOSE_CONNECTION_READY_STATES: {
    DISCONNECTED: 0,
    CONNECTED: 1,
    CONNECTING: 2,
    DISCONNECTING: 3,
  },
};
