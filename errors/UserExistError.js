const { USER_EXIST_ERROR } = require('./config');

class UserExistError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = USER_EXIST_ERROR;
  }
}

module.exports.UserExistError = UserExistError;
