const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.patch("/me", auth, updateProfile);
router.get("/me", auth, getCurrentUser);

module.exports = router;
