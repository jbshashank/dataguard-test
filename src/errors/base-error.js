'use strict';

module.exports = class BaseError extends Error {
  constructor(level, message, code, statusCode = 500, data) {
    super(message);

    if (this.constructor === BaseError) {
      throw new TypeError('Abstract class "SuperError" cannot be instantiated directly.');
    }

    this.name = this.constructor.name;
    this.level = level;
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;
  }
};
