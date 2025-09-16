const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  updateItem,
  likeItem,
  deleteItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const { validateCreateItem } = require("../middlewares/validation");

// Create
router.post("/", auth, validateCreateItem, createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", auth, updateItem);
router.put("/:itemId/likes", auth, likeItem);

// Delete
router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, unlikeItem);
module.exports = router;
