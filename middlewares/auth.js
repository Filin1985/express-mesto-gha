/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new UnauthorizedError('Необходима авторизация', 'UnauthorizedError');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return new UnauthorizedError('Необходима авторизация', 'UnauthorizedError');
  }
  req.user = payload;

  next();
};
