const { INCORRECT_DATA_ERROR } = require('./config');

module.exports = class RequestError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = INCORRECT_DATA_ERROR;
  }
};
