const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { handleNotFound } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use(handleNotFound);

module.exports = router;
