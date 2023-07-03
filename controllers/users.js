const User = require("../models/user");

const INCORRECT_DATA_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;

class RequestError extends Error {
  constructor(message, name) {
    super(message);
    this.errorName = name;
    this.status = NOT_FOUND_ERROR;
  }
}

class NotFoundError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
    this.status = NOT_FOUND_ERROR;
  }
}

class ServerError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
    this.status = SERVER_ERROR;
  }
}

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (err) {
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка cервера!" });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new RequestError("Такого id не существует!", "RequestError");
    }
    res.send({ user });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({ message: "Запрашиваемый пользователь не найден!" });
    }
    if (err.errorName === "RequestError") {
      return res.status(err.status).send({ message: err.message });
    }
    console.log(
      `Статус ${err.statusCode}. Ошибка ${err.name} c текстом ${err.errorName}`
    );
    return res
      .status(err.message)
      .send({ message: "Внутрення ошибка сервера!" });
  }
};

module.exports.createNewUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.send({ newUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(INCORRECT_DATA_ERROR).send({
        message: "При создании пользователя переданы неверные данные!",
      });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const owner = req.user._id;
    const userForUpdate = await User.findById({ _id: owner });
    if (userForUpdate) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: owner },
        { ...req.body },
        { new: true }
      );
      res.send({ updatedUser });
    } else {
      throw new Error(`У вас нет прав на редактирование данного пользователя!`);
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(INCORRECT_DATA_ERROR).send({
        message: "При обновлении пользователя переданы неверные данные!",
      });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const owner = req.user._id;
    const userForUpdate = await User.findById({ _id: owner });
    if (userForUpdate) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: owner },
        { avatar: avatar },
        { new: true }
      );
      res.send({ updatedUser });
    } else {
      throw new Error(`У вас нет прав на редактирование данного пользователя!`);
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(INCORRECT_DATA_ERROR).send({
        message: "При обновлении пользователя переданы неверные данные!",
      });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};
