const ClothingItem = require("../models/clothingItem");

const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.log(err);
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// POST /items
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: err.message, err });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message, err });
      }
    });
};

// PUT /items/:itemId
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

// PUT /items/:itemId/likes
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.message === "Item not found") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(new Error("Item not found"))
    .then(() => res.status(200).send({}))
    .catch((err) => {
      if (err.message === "Item not found") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

// DELETE /items/:itemId/likes
const unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.message === "Item not found") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  likeItem,
  deleteItem,
  unlikeItem,
};
