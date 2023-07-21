const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ cards });
  } catch (err) {
    next(err);
  }
};

module.exports.createNewCard = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner });
    res.status(201).send({ newCard });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById({ _id: cardId });
    if (!card) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    if (userId !== card.owner.valueOf()) {
      throw new ForbiddenError('Вы не имеете права удалять чужие карточки!', 'ForbiddenError');
    }
    await card.deleteOne();
    res.status(200).send({ card });
  } catch (err) {
    next(err);
  }
};

module.exports.addLikeToCard = async (req, res, next) => {
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
    next(err);
  }
};

module.exports.deleteLikeFromCard = async (req, res, next) => {
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
    next(err);
  }
};
