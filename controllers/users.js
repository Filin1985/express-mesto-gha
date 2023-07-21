/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');

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
    if (!userForUpdate) {
      throw new NotFoundError('Такого пользователя не существует!', 'NotFoundError');
    }
    const updatedUser = await User.findByIdAndUpdate(
      owner,
      { ...req.body },
      { new: true, runValidators: true },
    );
    res.send({ updatedUser });
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
    if (!userForUpdate) {
      throw new NotFoundError('Такого пользователя не существует!', 'NotFoundError');
    }
    const updatedUser = await User.findByIdAndUpdate(
      owner,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send({ updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true });
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
