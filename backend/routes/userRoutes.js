
// routes/userRoutes.js
const router = require("express").Router();
const c = require("../controllers/userController");

router.get("/", c.getUsers);

module.exports = router;
