const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  likeItem,
  deleteItem,
  unlikeItem,
} = require("../controllers/clothingItems");

//Create
router.post("/", createItem);

//Read
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);

//Delete
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", unlikeItem);
module.exports = router;
