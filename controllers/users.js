/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');
const { RequestError } = require('../errors/RequestError');
const { UserExistError } = require('../errors/UserExistError');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    res.send({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new UserExistError('Пользователь с таким email уже существует!', 'UserExistError');
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = await User.create({
      ...req.body, password: hashedPassword,
    });
    res.status(201).send({ newUser });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { name, about } = req.body;
    const isValidLength = name?.length > 2
    && name?.length < 30
      && about?.length > 2
      && about?.length < 30;
    if (!isValidLength) {
      throw new RequestError(
        'Количество символов в полях не должны быть меньше 2 и больше 30!',
        'RequestError',
      );
    }
    const userForUpdate = await User.findById({ _id: owner });
    if (userForUpdate) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: owner },
        { ...req.body },
        { new: true },
      );
      res.send({ updatedUser });
    } else {
      throw new Error('У вас нет прав на редактирование данного пользователя!');
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const user = await User.findById({ _id: ownerId });
    if (!user) {
      throw new NotFoundError('Такого id не существует!', 'NotFoundError');
    }
    res.send({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const userForUpdate = await User.findById({ _id: owner });
    if (userForUpdate) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: owner },
        { avatar },
        { new: true },
      );
      res.send({ updatedUser });
    } else {
      throw new Error('У вас нет прав на редактирование данного пользователя!');
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new NotFoundError('Неправильные почта или пароль', 'NotFoundError');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true }).end();
  } catch (err) {
    next(err);
  }
};
