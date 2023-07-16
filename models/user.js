/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const { UnauthorizedError } = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный Email',
    },
    unique: true,
    dropDups: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [8, 'Минимальная длина поля "password" - 8'],
  },
}, { versionKey: false, toObject: { useProjection: true }, toJSON: { useProjection: true } });

// eslint-disable-next-line func-names, no-unused-vars
userSchema.statics.findUserByCredentials = async function (email, password, next) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль', 'UnauthorizedError');
    }

    try {
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model('user', userSchema);
