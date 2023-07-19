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
const { REG_EXP } = require('../config');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(new RegExp(REG_EXP))
      .min(2)
      .max(30),
  }),
}), createNewCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().min(24).max(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().min(24).max(24),
  }),
}), addLikeToCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().min(24).max(24),
  }),
}), deleteLikeFromCard);

module.exports = router;
