const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('CONNECTION OPEN'))
  .catch((error) => console.log(error));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64a2abe664cc028738197651',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Такого запроса нет!' });
});

app.listen(PORT, () => {
  console.log('Server are running!');
});
