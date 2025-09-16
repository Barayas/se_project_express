const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Endpoint not found"));
});

module.exports = router;
