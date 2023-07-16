const { SERVER_ERROR, INCORRECT_DATA_ERROR } = require('../errors/config');

module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(INCORRECT_DATA_ERROR).send({
      message: 'В запросе переданы неверные данные!',
    });
  }
  if (err.errorName === 'RequestError') {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.errorName === 'NotFoundError') {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.code === 'UserExistError') {
    return res.status(err.status).send({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res
      .status(INCORRECT_DATA_ERROR)
      .send({ message: 'Запрашиваемые данные не найдены!' });
  }
  return res
    .status(SERVER_ERROR)
    .send({ message: 'Внутрення ошибка сервера!' });
};
