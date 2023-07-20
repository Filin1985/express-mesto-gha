/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

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
    const { password } = req.body;
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
    const userForUpdate = await User.findById({ _id: owner });
    if (userForUpdate) {
      const updatedUser = await User.findByIdAndUpdate(
        owner,
        { ...req.body },
        { new: true, runValidators: true },
      );
      res.send({ updatedUser });
    } else {
      throw new UnauthorizedError('У вас нет прав на редактирование данного пользователя!', 'UnauthorizedError');
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
        owner,
        { avatar },
        { new: true, runValidators: true },
      );
      res.send({ updatedUser });
    } else {
      throw UnauthorizedError('У вас нет прав на редактирование данного пользователя!', 'UnauthorizedError');
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true }).send().end();
  } catch (err) {
    next(UnauthorizedError('Неправильные почта или пароль', 'UnauthorizedError'));
  }
};
