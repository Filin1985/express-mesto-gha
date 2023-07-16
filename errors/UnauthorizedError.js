const { UNAUTHORIZED_ERROR } = require('./config');

class UnauthorizedError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = UNAUTHORIZED_ERROR;
  }
}

module.exports.UnauthorizedError = UnauthorizedError;
