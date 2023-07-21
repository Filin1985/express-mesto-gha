/* eslint-disable import/no-extraneous-dependencies */
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createNewCard,
  addLikeToCard,
  deleteLikeFromCard,
} = require('../controllers/cards');
// eslint-disable-next-line camelcase
const { URl_VALIDATOR_REG_EXP } = require('../config');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(new RegExp(URl_VALIDATOR_REG_EXP))
      .min(2)
      .max(30),
  }),
}), createNewCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), addLikeToCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteLikeFromCard);

module.exports = router;
