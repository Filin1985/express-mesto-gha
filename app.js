/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { login, createNewUser } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log('CONNECTION OPEN'))
  .catch((error) => console.log(error));

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30).url(),
    about: Joi.string().min(2).max(30),
  }),
}), createNewUser);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Такого запроса нет!' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server are running!');
});
