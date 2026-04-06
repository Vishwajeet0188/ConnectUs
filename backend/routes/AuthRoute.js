const { Signup, Login } = require("../controllers/AuthController");
const { googleAuth } = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google", googleAuth);

module.exports = router;