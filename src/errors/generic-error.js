'use strict';

const BaseError = require('./base-error');

/**
 * Creates an error group, that may be extended further to create custom errors.
 *
 * @param error:klass the name of the error group
 * @param statusCode:statusCodeDefault the default http status code to use for this type of errors
 * @returns {*}
 */
const createGenericErrorType = ({ error: klass, statusCode: statusCodeDefault = 500 }) => ({
  [klass]:
    class extends BaseError {
      constructor(level, message, code, statusCode, data) {
        super(level, message, code, statusCode || statusCodeDefault, data);

        if (this.constructor.name === klass) {
          throw new TypeError(`Abstract class "${klass}" cannot be instantiated directly.`);
        }
      }
    },
}[klass]);

module.exports = {
  createGenericErrorType,
};
