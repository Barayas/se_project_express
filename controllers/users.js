const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZE,
  CONFLICT_ERROR,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      console.log(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      console.log(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
