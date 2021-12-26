'use strict';

const once = (func) => {
  let result = null;

  return async () => {
    if (result !== null) return result;
    result = func();
    return result;
  };
};

module.exports = { once };
