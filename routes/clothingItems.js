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

const {
  validateCreateItem,
  validateItemIDFormat,
} = require("../middlewares/validation");

// Create
router.post("/", auth, validateCreateItem, createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", validateItemIDFormat, auth, updateItem);
router.put("/:itemId/likes", validateItemIDFormat, auth, likeItem);

// Delete
router.delete("/:itemId", validateItemIDFormat, auth, deleteItem);
router.delete("/:itemId/likes", validateItemIDFormat, auth, unlikeItem);
module.exports = router;
