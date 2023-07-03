const Card = require("../models/card");

const INCORRECT_DATA_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;

class NotFoundError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = NOT_FOUND_ERROR;
  }
}

class RequestError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = INCORRECT_DATA_ERROR;
  }
}

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ cards });
  } catch (err) {
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.createNewCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    console.log(name, link, owner);
    const newCard = await Card.create({ name, link, owner });
    console.log(newCard);
    res.send({ newCard });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: "При создании карточки переданы неверные данные!" });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove({ _id: cardId });
    res.send({ card });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: "Запрашиваемая карточка не найдена!" });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.addLikeToCard = async (req, res) => {
  try {
    const cardWithLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!cardWithLike) {
      throw new NotFoundError("Такого id не существует!", "NotFoundError");
    }
    res.send({ cardWithLike });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: "Запрашиваемая карточка не найдена!" });
    }
    if (err.errorName === "NotFoundError") {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.deleteLikeFromCard = async (req, res) => {
  try {
    const cardWithoutLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!cardWithoutLike) {
      throw new NotFoundError("Такого id не существует!", "NotFoundError");
    }
    res.send({ cardWithoutLike });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: "Запрашиваемая карточка не найдена!" });
    }
    if (err.errorName === "NotFoundError") {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};
