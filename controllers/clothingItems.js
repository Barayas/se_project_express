const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// GET /items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
        res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// PUT /items/:itemId
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId.toString()) {
        return res.status(FORBIDDEN).send({ message: "Access denied" });
      }
      return ClothingItem.findByIdAndUpdate(
        itemId,
        {
          $set: { imageUrl },
        },
        { new: true }
      ).then((updatedItem) => res.status(200).send({ data: updatedItem }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
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
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });

// DELETE /items/:itemId
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId.toString()) {
        return res.status(FORBIDDEN).send({ message: "Access denied" });
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Id format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
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
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
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
