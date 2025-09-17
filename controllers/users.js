const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { InternalServerError } = require("../utils/InternalServerError");
const { ConflictError } = require("../utils/ConflictError");
const { UnauthorizedError } = require("../utils/UnauthorizedError");

// PATCH /users/me
const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(Object.values(err.errors)[0].message));
      }

      return next(
        new InternalServerError("An error has occurred on the server.")
      );
    });
};

// POST /signup
const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return next(new BadRequestError(Object.values(err.errors)[0].message));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email already in use."));
      }
      return next(
        new InternalServerError("An error has occurred on the server.")
      );
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password."));
      }
      return next(
        new InternalServerError("An error has occurred on the server.")
      );
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Bad request"));
      }
      return next(
        new InternalServerError("An error has occurred on the server.")
      );
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
