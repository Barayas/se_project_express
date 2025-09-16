const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateEditUser } = require("../middlewares/validation");

router.patch("/me", auth, validateEditUser, updateProfile);
router.get("/me", auth, getCurrentUser);

module.exports = router;
