const User = require("../models/user");

const INCORRECT_DATA_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;

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
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    res.send({ user });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: "Запрашиваемый пользователь не найден!" });
    }
    console.log(
      `Статус ${err.status}. Ошибка ${err.name} c текстом ${err.message}`
    );
    return res
      .status(SERVER_ERROR)
      .send({ message: "Внутрення ошибка червера!" });
  }
};

module.exports.createNewUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.send({ newUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({
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
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({
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
      return res
        .status(INCORRECT_DATA_ERROR)
        .send({
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
