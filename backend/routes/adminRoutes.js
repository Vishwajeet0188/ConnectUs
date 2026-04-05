const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../middleware/verifyAdmin");

// 🔹 Test token route
// router.get("/test-token", (req, res) => {
//     const token = jwt.sign(
//         { id: "123", role: "admin" },
//         process.env.TOKEN_KEY
//     );

//     res.json({ token });
// });

// 🔹 Protected admin route
router.get("/dashboard", verifyAdmin, (req, res) => {
    res.json({ message: "Admin dashboard data" });
});

module.exports = router;