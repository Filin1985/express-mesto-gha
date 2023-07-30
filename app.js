/* eslint-disable no-useless-escape */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { login, createNewUser } = require('./controllers/users');
const { NotFoundError } = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// eslint-disable-next-line camelcase
const { URl_VALIDATOR_REG_EXP } = require('./config');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('CONNECTION OPEN'))
  .catch((error) => console.log(error));

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(URl_VALIDATOR_REG_EXP)).min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createNewUser);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы нет!', 'NotFoundError'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server are running!');
});
