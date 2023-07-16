const { FORBIDDEN_ERROR } = require('./config');

class ForbiddenError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = FORBIDDEN_ERROR;
  }
}

module.exports.ForbiddenError = ForbiddenError;
