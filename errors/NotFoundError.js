const { NOT_FOUND_ERROR } = require('./config');

module.exports = class NotFoundError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = NOT_FOUND_ERROR;
  }
};
