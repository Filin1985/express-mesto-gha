/* eslint-disable import/no-extraneous-dependencies */
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserProfile,
} = require('../controllers/users');
// eslint-disable-next-line camelcase
const { URl_VALIDATOR_REG_EXP } = require('../config');

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(new RegExp(URl_VALIDATOR_REG_EXP)),
  }),
}), updateUserAvatar);

module.exports = router;
