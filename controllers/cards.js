const { SERVER_ERROR, INCORRECT_DATA_ERROR } = require('../errors/config');
const { NotFoundError } = require('../errors/NotFoundError');

const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ cards });
  } catch (err) {
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`,
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Внутрення ошибка червера!' });
  }
};

module.exports.createNewCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner });
    res.status(201).send({ newCard });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: 'При создании карточки переданы неверные данные!' });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`,
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Внутрення ошибка червера!' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove({ _id: cardId });
    if (!card) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    res.send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: 'Запрашиваемая карточка не найдена!' });
    }
    if (err.errorName === 'NotFoundError') {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`,
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Внутрення ошибка червера!' });
  }
};

module.exports.addLikeToCard = async (req, res) => {
  try {
    const cardWithLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardWithLike) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    res.send({ cardWithLike });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: 'Запрашиваемая карточка не найдена!' });
    }
    if (err.errorName === 'NotFoundError') {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`,
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Внутрення ошибка червера!' });
  }
};

module.exports.deleteLikeFromCard = async (req, res) => {
  try {
    const cardWithoutLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardWithoutLike) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    res.send({ cardWithoutLike });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: 'Запрашиваемая карточка не найдена!' });
    }
    if (err.errorName === 'NotFoundError') {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`,
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Внутрення ошибка червера!' });
  }
};
